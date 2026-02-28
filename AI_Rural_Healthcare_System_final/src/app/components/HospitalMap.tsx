import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Phone, Plus, Minus, Layers, X } from 'lucide-react';
import type { NearbyHospital } from '../services/hospitalLocator';

interface HospitalMapProps {
  hospitals: NearbyHospital[];
  onNavigate: (hospital: NearbyHospital) => void;
  onClose: () => void;
  center?: { lat: number; lng: number } | null;
}

const TILE_SIZE = 256;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function project(lat: number, lng: number, zoom: number) {
  const safeLat = clamp(lat, -85.05112878, 85.05112878);
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const sinLat = Math.sin((safeLat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y, scale };
}

export default function HospitalMap({ hospitals, onNavigate, onClose, center }: HospitalMapProps) {
  const [selectedHospital, setSelectedHospital] = useState<NearbyHospital | null>(null);
  const [zoom, setZoom] = useState(14);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapSize, setMapSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (selectedHospital && !hospitals.some((h) => h.name === selectedHospital.name)) {
      setSelectedHospital(null);
    }
  }, [hospitals, selectedHospital]);

  useEffect(() => {
    const node = mapRef.current;
    if (!node) return;

    const updateSize = () => {
      setMapSize({ width: node.clientWidth || 800, height: node.clientHeight || 600 });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const derivedCenter = useMemo(() => {
    if (center) return center;
    if (hospitals.length === 0) return { lat: 9.9252, lng: 78.1198 };
    const total = hospitals.reduce(
      (acc, h) => ({ lat: acc.lat + h.lat, lng: acc.lng + h.lng }),
      { lat: 0, lng: 0 }
    );
    return { lat: total.lat / hospitals.length, lng: total.lng / hospitals.length };
  }, [center, hospitals]);

  const centerPoint = useMemo(() => project(derivedCenter.lat, derivedCenter.lng, zoom), [derivedCenter, zoom]);

  const pins = useMemo(() => {
    return hospitals.map((hospital) => {
      const point = project(hospital.lat, hospital.lng, zoom);
      return {
        ...hospital,
        x: mapSize.width / 2 + (point.x - centerPoint.x),
        y: mapSize.height / 2 + (point.y - centerPoint.y),
      };
    });
  }, [hospitals, zoom, centerPoint, mapSize]);

  const tiles = useMemo(() => {
    if (mapType !== 'standard') return [] as Array<{ key: string; left: number; top: number; url: string }>;

    const worldTileCount = Math.pow(2, zoom);
    const centerTileX = centerPoint.x / TILE_SIZE;
    const centerTileY = centerPoint.y / TILE_SIZE;
    const baseTileX = Math.floor(centerTileX);
    const baseTileY = Math.floor(centerTileY);

    const radiusX = Math.ceil(mapSize.width / TILE_SIZE / 2) + 1;
    const radiusY = Math.ceil(mapSize.height / TILE_SIZE / 2) + 1;

    const output: Array<{ key: string; left: number; top: number; url: string }> = [];

    for (let dx = -radiusX; dx <= radiusX; dx += 1) {
      for (let dy = -radiusY; dy <= radiusY; dy += 1) {
        const tileX = baseTileX + dx;
        const tileY = baseTileY + dy;

        if (tileY < 0 || tileY >= worldTileCount) continue;

        const wrappedTileX = ((tileX % worldTileCount) + worldTileCount) % worldTileCount;
        const left = mapSize.width / 2 + tileX * TILE_SIZE - centerPoint.x;
        const top = mapSize.height / 2 + tileY * TILE_SIZE - centerPoint.y;

        output.push({
          key: `${zoom}-${tileX}-${tileY}`,
          left,
          top,
          url: `https://tile.openstreetmap.org/${zoom}/${wrappedTileX}/${tileY}.png`,
        });
      }
    }

    return output;
  }, [zoom, centerPoint, mapSize, mapType]);

  return (
    <div
      ref={mapRef}
      className="relative w-full h-[600px] bg-[#e5e3df] rounded-2xl overflow-hidden border border-gray-300 shadow-inner group"
      onWheel={(e) => {
        e.preventDefault();
        setZoom((z) => {
          const next = e.deltaY < 0 ? z + 1 : z - 1;
          return Math.max(3, Math.min(18, next));
        });
      }}
    >
      <div className="absolute inset-0 transition-all duration-300 bg-[#dfe7ef]">
        {mapType === 'standard' ? (
          <>
            {tiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.url}
                alt="map tile"
                className="absolute w-64 h-64 select-none pointer-events-none"
                style={{ left: tile.left, top: tile.top }}
                draggable={false}
                loading="lazy"
              />
            ))}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/10" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.8,
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 overflow-hidden z-10">
        {pins
          .filter((hospital) => hospital.x > -40 && hospital.x < mapSize.width + 40 && hospital.y > -40 && hospital.y < mapSize.height + 40)
          .map((hospital, index) => (
            <motion.div
              key={hospital.name}
              className="absolute cursor-pointer"
              style={{
                left: hospital.x,
                top: hospital.y,
                transform: 'translate(-50%, -100%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              onClick={() => setSelectedHospital(hospital)}
            >
              <div className="relative">
                <MapPin
                  className={`w-10 h-10 ${selectedHospital?.name === hospital.name ? 'text-blue-600' : 'text-red-500'} drop-shadow-md`}
                  fill="currentColor"
                  stroke="#fff"
                  strokeWidth="1"
                />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}

        {pins.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-white/95 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 shadow">
              No hospitals found for this search.
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-3 left-3 z-20">
        <div className="bg-white/95 rounded-md shadow-md px-3 py-2 border border-gray-200 text-xs font-semibold text-gray-700">
          {hospitals.length} hospital{hospitals.length === 1 ? '' : 's'} shown
        </div>
      </div>

      <div className="absolute top-3 right-3 z-30">
        <button
          onClick={onClose}
          className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:bg-gray-100 border border-gray-200"
          aria-label="Close map"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-8 right-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col bg-white rounded-md shadow-md border border-gray-200 overflow-hidden">
          <button
            onClick={() => setZoom((z) => Math.min(z + 1, 18))}
            className="p-3 hover:bg-gray-100 border-b border-gray-100 text-gray-600"
            aria-label="Zoom in"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 1, 3))}
            className="p-3 hover:bg-gray-100 text-gray-600"
            aria-label="Zoom out"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          className="bg-white p-3 rounded-md shadow-md text-gray-600 hover:bg-gray-100 border border-gray-200"
          aria-label="Toggle map layer"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 max-w-[90%] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 line-clamp-1">{selectedHospital.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-green-600">Open 24 hours</span>
                    <span>{selectedHospital.distance}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Close hospital details"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate(selectedHospital)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </button>
                {selectedHospital.phone ? (
                  <a
                    href={`tel:${selectedHospital.phone}`}
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 text-blue-600"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="p-2 border border-gray-200 rounded-full text-gray-400 cursor-not-allowed"
                    aria-label="Phone number unavailable"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
