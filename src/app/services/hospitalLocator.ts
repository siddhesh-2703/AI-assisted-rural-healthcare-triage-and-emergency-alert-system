export interface NearbyHospital {
  name: string;
  type: string;
  distance: string;
  time: string;
  phone: string;
  beds: string;
  emergency: boolean;
  lat: number;
  lng: number;
  address: string;
}

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toRadians = (value: number) => (value * Math.PI) / 180;

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function deriveType(tags: Record<string, string>): string {
  const values = `${tags.healthcare || ''} ${tags.amenity || ''} ${tags.operator_type || ''}`.toLowerCase();
  if (values.includes('government') || values.includes('public')) return 'Government';
  if (values.includes('clinic') || values.includes('health')) return 'Clinic';
  if (values.includes('private')) return 'Private';
  return 'Hospital';
}

function deriveAddress(tags: Record<string, string>): string {
  const parts = [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'], tags['addr:city']].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  return tags['addr:full'] || tags['is_in'] || 'Address not available';
}

function derivePhone(tags: Record<string, string>): string {
  return tags.phone || tags['contact:phone'] || '';
}

export async function fetchNearbyHospitals(lat: number, lng: number, radiusMeters = 10000): Promise<NearbyHospital[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      relation["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
      way["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
      relation["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
    );
    out center tags;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Hospital lookup failed: ${response.status}`);
  }

  const data = (await response.json()) as OverpassResponse;
  const seen = new Set<string>();

  const hospitals = data.elements
    .map((element) => {
      const tags = element.tags || {};
      const hLat = element.lat ?? element.center?.lat;
      const hLng = element.lon ?? element.center?.lon;

      if (!hLat || !hLng) return null;

      const name = tags.name || 'Unnamed Hospital';
      const key = `${name.toLowerCase()}-${hLat.toFixed(4)}-${hLng.toFixed(4)}`;
      if (seen.has(key)) return null;
      seen.add(key);

      const dist = distanceKm(lat, lng, hLat, hLng);
      const etaMinutes = Math.max(3, Math.round((dist / 28) * 60));

      return {
        name,
        type: deriveType(tags),
        distance: `${dist.toFixed(1)} km`,
        time: `${etaMinutes} min`,
        phone: derivePhone(tags),
        beds: 'Unknown',
        emergency: (tags.emergency || '').toLowerCase() === 'yes',
        lat: hLat,
        lng: hLng,
        address: deriveAddress(tags),
      } satisfies NearbyHospital;
    })
    .filter((item): item is NearbyHospital => Boolean(item))
    .sort((a, b) => {
      const aDist = parseFloat(a.distance);
      const bDist = parseFloat(b.distance);
      return aDist - bDist;
    });

  return hospitals;
}

export function filterHospitals(hospitals: NearbyHospital[], query: string): NearbyHospital[] {
  const q = normalize(query);
  if (!q) return hospitals;

  const tokens = q.split(' ').filter(Boolean);

  return hospitals
    .map((hospital) => {
      const searchable = normalize(`${hospital.name} ${hospital.type} ${hospital.address}`);
      let score = 0;
      if (searchable.includes(q)) score += 5;
      for (const token of tokens) {
        if (searchable.includes(token)) score += 1;
      }
      return { hospital, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.hospital);
}
