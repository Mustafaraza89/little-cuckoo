'use client';

import React, { useState } from 'react';
import { Users, ShieldCheck, Plus, Mail, Shield, CheckCircle2, UserCheck, Key } from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'ORDER_MANAGER' | 'SUPPORT_AGENT';
  status: 'ACTIVE' | 'INVITED';
  lastActive: string;
}

const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'u-1',
    name: 'Vadaliya Bhimjibhai',
    email: 'admin@littlecuckoo.com',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    lastActive: 'Just now',
  },
  {
    id: 'u-2',
    name: 'Anant Workshop Catalog Lead',
    email: 'catalog@littlecuckoo.com',
    role: 'PRODUCT_MANAGER',
    status: 'ACTIVE',
    lastActive: '2 hours ago',
  },
  {
    id: 'u-3',
    name: 'Rajkot Dispatch Hub',
    email: 'dispatch@littlecuckoo.com',
    role: 'ORDER_MANAGER',
    status: 'ACTIVE',
    lastActive: '30 mins ago',
  },
];

export default function AdminUsersPage() {
  const [staff, setStaff] = useState<StaffUser[]>(INITIAL_STAFF);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'ORDER_MANAGER'>('ORDER_MANAGER');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStaff([
      ...staff,
      {
        id: `u-${Date.now()}`,
        name,
        email,
        role,
        status: 'INVITED',
        lastActive: 'Never',
      },
    ]);
    setShowModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Access Control & RBAC
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Admin Users & Roles</h1>
          <p className="text-xs text-cocoa-500">
            Manage administrative personnel, warehouse operators, and role-based permissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      {/* Roles Matrix Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-strawberry-600 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Administrator</span>
          </div>
          <p className="text-xs text-cocoa-500">
            Full root authority: user management, financial reports, CMS, inventory, and API settings.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-babyblue-600 font-bold text-xs">
            <Shield className="w-4 h-4" />
            <span>Product & Catalog Lead</span>
          </div>
          <p className="text-xs text-cocoa-500">
            Manage products, variants, pricing, category tree, and media library lookbooks.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <UserCheck className="w-4 h-4" />
            <span>Order & Inventory Operator</span>
          </div>
          <p className="text-xs text-cocoa-500">
            Fulfill orders, generate shipping labels, update stock counts, and handle returns.
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vanilla-100 text-charcoal-700 font-bold border-b border-cocoa-500/10">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10 text-cocoa-600">
              {staff.map((u) => (
                <tr key={u.id} className="hover:bg-vanilla-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-charcoal-700">{u.name}</p>
                    <p className="text-[11px] text-cocoa-400 font-mono">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-charcoal-700">{u.role}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-cocoa-400">{u.lastActive}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Permissions for ${u.name} can be modified by Super Admin.`)}
                      className="text-xs font-bold text-strawberry-600 hover:text-strawberry-700 underline"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-lift w-full max-w-md p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-700">Invite Staff Member</h3>
            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@littlecuckoo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Administrative Role *</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20 bg-white"
                >
                  <option value="PRODUCT_MANAGER">Product & Catalog Lead</option>
                  <option value="ORDER_MANAGER">Order & Inventory Operator</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-cocoa-500/20 text-cocoa-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
