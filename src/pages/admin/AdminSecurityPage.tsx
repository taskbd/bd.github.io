import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Shield,
  Search,
  CheckCircle,
  AlertTriangle,
  Lock,
  Smartphone,
  Globe,
  Radio,
} from 'lucide-react';

export const AdminSecurityPage: React.FC = () => {
  const { securityLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = securityLogs.filter((log) => {
    return (
      log.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Live Security & Session Events Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time monitoring of user authentications, OTP challenges, password updates, and IP locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Active Firewall Protection</span>
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email, action, IP address or location..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Event ID / Time</th>
                <th className="p-4">Account Email</th>
                <th className="p-4">Security Action</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-bold text-slate-900 dark:text-white">#{ev.id}</p>
                    <p className="text-[11px] text-slate-400">{ev.timestamp}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">
                    {ev.actorEmail}
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                    {ev.action}
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    {ev.ipAddress}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {ev.location}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ev.status === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
