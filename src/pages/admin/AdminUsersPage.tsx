import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  Ban,
  Wallet,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { wallets, adminToggleUserSuspension } = useData();

  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive mock platform users
  const [userList, setUserList] = useState([
    {
      id: 'TBD-78241',
      name: 'Tanvir Hossain',
      email: 'tanvir.dev@gmail.com',
      phone: '01712-345678',
      role: 'user',
      verificationStatus: 'approved',
      publishingStatus: 'active',
      joinedDate: '2026-08-01',
      isSuspended: false,
    },
    {
      id: 'TBD-33910',
      name: 'Nusrat Jahan',
      email: 'nusrat.designer@gmail.com',
      phone: '01890-112233',
      role: 'user',
      verificationStatus: 'approved',
      publishingStatus: 'active',
      joinedDate: '2026-08-05',
      isSuspended: false,
    },
    {
      id: 'TBD-99182',
      name: 'Rafiqul Islam',
      email: 'rafiqul.dev@gmail.com',
      phone: '01911-554433',
      role: 'user',
      verificationStatus: 'approved',
      publishingStatus: 'active',
      joinedDate: '2026-08-08',
      isSuspended: false,
    },
    {
      id: 'TBD-11092',
      name: 'ShopBD Tech',
      email: 'team@shopbd.com',
      phone: '01678-990011',
      role: 'user',
      verificationStatus: 'approved',
      publishingStatus: 'active',
      joinedDate: '2026-08-10',
      isSuspended: false,
    },
  ]);

  const filteredUsers = userList.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleSuspension = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u))
    );
    adminToggleUserSuspension(userId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          User & Identity Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Inspect member accounts, verification badges, seller credentials, and account suspension controls.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by User ID, Name, or Email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">User ID & Joined</th>
                <th className="p-4">Full Name & Contact</th>
                <th className="p-4 text-center">Verified Badge</th>
                <th className="p-4 text-center">Seller Privilege</th>
                <th className="p-4 text-right">Wallet Balance</th>
                <th className="p-4 text-center">Account Status</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((usr) => {
                const userBal = wallets[usr.id]?.availableBalance ?? 1250;
                return (
                  <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">#{usr.id}</p>
                      <p className="text-[11px] text-slate-400">{usr.joinedDate}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{usr.name}</p>
                      <p className="text-[11px] text-slate-400">{usr.email}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          usr.verificationStatus === 'approved'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {usr.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          usr.publishingStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {usr.publishingStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                      ৳{userBal.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          usr.isSuspended
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {usr.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleSuspension(usr.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                          usr.isSuspended
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                        }`}
                      >
                        {usr.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
