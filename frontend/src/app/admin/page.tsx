'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Store, Package, ShoppingBag, CheckCircle, XCircle, Ban, Flag, Loader2, Plus, Pencil, Trash2, Activity, PieChart as PieChartIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { categoryService } from '@/services/category.service';
import Navbar from '@/components/navbar/Navbar';
import { useAuthStore } from '@/store/auth.store';
import api from '@/services/api';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'sellers' | 'users' | 'reports' | 'categories';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'ADMIN') { router.push('/'); return; }
    loadData();
  }, [isAuthenticated, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, sellersRes, usersRes, reportsRes, categoryRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/sellers/pending'),
        api.get('/admin/users'),
        api.get('/admin/reports'),
        categoryService.getAll(),
      ]);
      setStats(statsRes.data);
      setPendingSellers(sellersRes.data);
      setUsers(usersRes.data.data);
      setReports(reportsRes.data);
      setCategories(categoryRes);
    } catch { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  };

  const approveSeller = async (id: string) => {
    try {
      await api.put(`/admin/sellers/${id}/approve`);
      toast.success('Seller approved');
      setPendingSellers((prev) => prev.filter((s) => s.id !== id));
      setStats((prev: any) => ({ ...prev, pendingSellers: prev.pendingSellers - 1, totalSellers: prev.totalSellers + 1 }));
    } catch { toast.error('Failed to approve seller'); }
  };

  const rejectSeller = async (id: string) => {
    try {
      await api.put(`/admin/sellers/${id}/reject`);
      toast.success('Seller rejected');
      setPendingSellers((prev) => prev.filter((s) => s.id !== id));
    } catch { toast.error('Failed to reject seller'); }
  };

  const banUser = async (id: string) => {
    if (!confirm('Ban this user?')) return;
    try {
      await api.put(`/admin/users/${id}/ban`);
      toast.success('User banned');
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: false } : u));
    } catch { toast.error('Failed to ban user'); }
  };

  const resolveReport = async (id: string) => {
    try {
      await api.put(`/admin/reports/${id}/resolve`);
      toast.success('Report resolved');
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch { toast.error('Failed to resolve report'); }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.id, categoryName);
        setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? updated : c));
        toast.success('Category updated');
      } else {
        const created = await categoryService.create(categoryName);
        setCategories((prev) => [...prev, created]);
        toast.success('Category created');
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryName('');
    } catch { toast.error('Failed to save category'); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete category'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: <Users className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Sellers', value: stats?.totalSellers, icon: <Store className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
    { label: 'Products', value: stats?.totalProducts, icon: <Package className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Orders', value: stats?.totalOrders, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Pending Sellers', value: stats?.pendingSellers, icon: <Store className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600' },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'sellers', label: `Pending Sellers (${pendingSellers.length})` },
    { key: 'users', label: 'Users' },
    { key: 'reports', label: `Reports (${reports.length})` },
    { key: 'categories', label: 'Categories' },
  ];

  const chartData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 800 },
    { name: 'Fri', sales: 500 },
    { name: 'Sat', sales: 900 },
    { name: 'Sun', sales: 1100 },
  ];

  const categoryDistribution = categories.map(c => ({
    name: c.name,
    value: Math.floor(Math.random() * 50) + 10 // Simulated distribution
  }));

  const COLORS = ['#2563eb', '#9333ea', '#db2777', '#ea580c', '#16a34a'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {statCards.map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{s.value ?? 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" /> Weekly Sales Growh
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: '#f3f4f6' }}
                      />
                      <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-600" /> Category Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution.slice(0, 5)}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        {tab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
              <button onClick={() => { setEditingCategory(null); setCategoryName(''); setShowCategoryModal(true); }}
                className="btn-primary flex items-center gap-2 py-2 px-4 shadow-lg shadow-blue-100">
                <Plus className="w-4 h-4" /> New Category
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingCategory(c); setCategoryName(c.name); setShowCategoryModal(true); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteCategory(c.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showCategoryModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                  <form onSubmit={handleCategorySubmit}>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category Name</label>
                    <input
                      autoFocus
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 mb-6"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Electronics, Fashion, etc."
                    />
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowCategoryModal(false)}
                        className="flex-1 py-3 font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors text-sm">
                        Cancel
                      </button>
                      <button type="submit"
                        className="flex-1 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all text-sm">
                        {editingCategory ? 'Save Changes' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pending Sellers */}
        {tab === 'sellers' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            {pendingSellers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p>No pending seller applications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingSellers.map((seller) => (
                  <div key={seller.id} className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{seller.businessName}</p>
                      <p className="text-sm text-gray-500">{seller.user?.email} · {seller.user?.phone}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{seller.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveSeller(seller.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => rejectSeller(seller.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'SELLER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.isActive && u.role !== 'ADMIN' && (
                        <button onClick={() => banUser(u.id)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium">
                          <Ban className="w-3.5 h-3.5" /> Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports */}
        {tab === 'reports' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            {reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Flag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p>No open reports</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-start gap-4 p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge bg-red-100 text-red-700 text-xs">{report.reason}</span>
                        {report.product && <span className="text-sm text-gray-500">· {report.product.title}</span>}
                      </div>
                      <p className="text-sm text-gray-600">{report.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Reported by {report.reporter?.firstName} {report.reporter?.lastName}
                      </p>
                    </div>
                    <button onClick={() => resolveReport(report.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors flex-shrink-0">
                      <CheckCircle className="w-4 h-4" /> Resolve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
