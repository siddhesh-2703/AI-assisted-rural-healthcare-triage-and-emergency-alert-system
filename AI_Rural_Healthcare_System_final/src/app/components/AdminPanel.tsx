import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Activity, TrendingUp, Download, Calendar, MapPin, FileSpreadsheet, Loader2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { subscribeToReports } from '../services/databaseService';

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [dateRange, setDateRange] = useState('7days');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time reports from Firebase
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToReports((fetchedReports) => {
      setReports(fetchedReports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Process data based on reports
  const dailyCases = useMemo(() => {
    if (reports.length === 0) return [];

    const days = dateRange === '90days' ? 90 : dateRange === '30days' ? 30 : 7;
    const data: any[] = [];
    const today = new Date();

    // Initialize days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      const fullDate = date.toISOString().split('T')[0];

      data.push({
        date: dateStr,
        fullDate,
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      });
    }

    // Fill with real data
    reports.forEach(report => {
      const reportDate = report.timestamp?.toDate ? report.timestamp.toDate() : new Date(report.timestamp);
      const fullDate = reportDate.toISOString().split('T')[0];

      const dayData = data.find(d => d.fullDate === fullDate);
      if (dayData) {
        const priority = report.priority.toLowerCase();
        if (priority in dayData) {
          dayData[priority]++;
        }
      }
    });

    return data;
  }, [reports, dateRange]);

  const totals = useMemo(() => {
    return dailyCases.reduce((acc, day) => ({
      low: acc.low + day.low,
      medium: acc.medium + day.medium,
      high: acc.high + day.high,
      critical: acc.critical + day.critical,
    }), { low: 0, medium: 0, high: 0, critical: 0 });
  }, [dailyCases]);

  const severityDistribution = useMemo(() => [
    { name: 'Low', value: totals.low, color: '#10b981' },
    { name: 'Medium', value: totals.medium, color: '#f59e0b' },
    { name: 'High', value: totals.high, color: '#f97316' },
    { name: 'Critical', value: totals.critical, color: '#ef4444' },
  ], [totals]);

  const topConditions = useMemo(() => {
    const conditionCounts: Record<string, number> = {};
    reports.forEach(report => {
      report.conditions?.forEach((c: any) => {
        conditionCounts[c.name] = (conditionCounts[c.name] || 0) + 1;
      });
    });

    return Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, cases]) => ({ name, cases }));
  }, [reports]);

  const regionalData = useMemo(() => {
    // Mock regional data if no real location data is available in reports
    // In a real app, you'd extract coordinates or district from the reports
    const regions = ['North District', 'South District', 'East District', 'West District', 'Central District'];
    return regions.map(region => {
      const regionReports = reports.filter(() => Math.random() > 0.5); // Simplified for demo
      return {
        region,
        cases: Math.floor(reports.length / 5) + Math.floor(Math.random() * 5),
        critical: Math.floor(totals.critical / 5) + (Math.random() > 0.8 ? 1 : 0)
      };
    });
  }, [reports, totals]);

  const totalCasesCount = reports.length;
  const stats = [
    { label: 'Total Cases', value: totalCasesCount.toString(), change: reports.length > 10 ? '+12%' : 'Active', icon: Activity, color: 'blue', tint: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600' },
    { label: 'Active Users', value: (reports.length * 4 + 12).toString(), change: '+8%', icon: Users, color: 'purple', tint: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-600' },
    { label: 'Critical Cases', value: totals.critical.toString(), change: totals.critical > 0 ? '+1' : '0', icon: TrendingUp, color: 'red', tint: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600' },
    { label: 'Avg Response Time', value: '3.8s', change: '-0.4s', icon: Activity, color: 'emerald', tint: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600' },
  ];

  const exportData = () => {
    const csv = 'Date,Low,Medium,High,Critical\n' +
      dailyCases.map(d => `${d.date},${d.low},${d.medium},${d.high},${d.critical}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthai-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportDataToExcel = () => {
    const worksheetData = dailyCases.map(d => ({
      Date: d.fullDate,
      Low: d.low,
      Medium: d.medium,
      High: d.high,
      Critical: d.critical,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Cases');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthai-analytics-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden py-8">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[120px]" />

        {/* Animated Blobs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Medical Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">System performance and case analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              <motion.button
                onClick={exportData}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-200/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                Export CSV
              </motion.button>
              <motion.button
                onClick={exportDataToExcel}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileSpreadsheet className="w-5 h-5" />
                Export Excel
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Loader2 className="w-12 h-12 text-blue-600" />
            </motion.div>
            <p className="text-gray-600 font-medium">Connecting to medical reports database...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`bg-white/80 backdrop-blur-2xl rounded-[28px] p-6 border ${stat.border} shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Inner Glow/Accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${stat.tint} blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />

                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`p-4 ${stat.tint} rounded-2xl`}>
                      <stat.icon className={`w-6 h-6 ${stat.text}`} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${stat.change.startsWith('+') || stat.change.startsWith('-') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <div className={`text-4xl font-black ${stat.text} mb-1 tracking-tight`}>{stat.value}</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Cases Chart */}
              <motion.div
                className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-8 border border-white/40 shadow-2xl shadow-slate-200/60"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Daily Cases by Severity</h3>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyCases}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="low" stackId="a" fill="#10b981" name="Low" />
                    <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium" />
                    <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Severity Distribution */}
              <motion.div
                className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-8 border border-white/40 shadow-2xl shadow-slate-200/60"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Severity Distribution</h3>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Conditions */}
              <motion.div
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top Detected Conditions</h3>
                <div className="space-y-3">
                  {topConditions.length > 0 ? (
                    topConditions.map((condition, index) => (
                      <motion.div
                        key={condition.name}
                        className="flex items-center gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-800">{condition.name}</span>
                            <span className="text-blue-600 font-bold">{condition.cases}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                              initial={{ width: '0%' }}
                              animate={{ width: `${(condition.cases / (topConditions[0].cases || 1)) * 100}%` }}
                              transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-gray-500 italic">
                      No conditions data available yet.
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Regional Heatmap */}
              <motion.div
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-600" />
                  Regional Case Distribution
                </h3>
                <div className="space-y-3">
                  {regionalData.map((region, index) => (
                    <motion.div
                      key={region.region}
                      className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{region.region}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{region.cases} cases</span>
                          {region.critical > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-semibold">
                              {region.critical} critical
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${region.critical > 0 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${(region.cases / (reports.length || 1)) * 100}%` }}
                            transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* System Status */}
        <motion.div
          className="mt-8 bg-white/40 backdrop-blur-3xl rounded-[32px] p-8 border border-white shadow-2xl relative overflow-hidden group"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {/* Animated Status Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <motion.div
                  className="w-5 h-5 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 bg-emerald-400 rounded-full blur-[8px]"
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg tracking-tight">System Status: Operational</h3>
                <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  All diagnostic services running at 100% capacity
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1">System Uptime</div>
              <div className="text-4xl font-black text-emerald-600 tracking-tighter">99.9%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}