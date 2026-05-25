'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Mail, Phone, Edit2, Loader2, Save, 
  Package, Heart, Settings, Shield, ChevronRight,
  LogOut, Star, Clock
} from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useAuthStore } from '@/store/auth.store';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) {
      setForm({ 
        firstName: user.firstName || '', 
        lastName: user.lastName || '', 
        phone: user.phone || '' 
      });
    }
  }, [isAuthenticated, user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/me', form);
      setUser({ ...user!, ...res.data });
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearUser();
    router.push('/');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Navigation */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-40" />
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 mb-4">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{user.firstName} {user.lastName}</h1>
                  <p className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mt-2">{user.role}</p>
                  
                  <div className="w-full h-px bg-gray-50 my-6" />
                  
                  <div className="w-full space-y-3">
                    <Link href="/orders" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all group">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        <span className="text-sm font-bold uppercase tracking-tight">My Orders</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link href="/favorites" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all group">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                        <span className="text-sm font-bold uppercase tracking-tight">Favorites</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 bg-red-50/50 text-red-500 rounded-2xl hover:bg-red-50 transition-all">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-tight">Logout</span>
                      </div>
                    </button>
                  </div>
               </div>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-2 font-black text-lg">0</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                </div>
                <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-2 font-black text-lg">0</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
                </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Profile Details</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your personal information</p>
                  </div>
                  <button 
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${editing ? 'bg-gray-100 text-gray-500' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700'}`}
                  >
                    {editing ? 'Cancel' : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                  </button>
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">First Name</label>
                       {editing ? (
                         <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all" />
                       ) : (
                         <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <User className="w-5 h-5 text-gray-300" />
                            <span className="font-bold text-gray-900">{user.firstName}</span>
                         </div>
                       )}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Name</label>
                       {editing ? (
                         <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all" />
                       ) : (
                         <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <User className="w-5 h-5 text-gray-300" />
                            <span className="font-bold text-gray-900">{user.lastName}</span>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-300" />
                            <span className="font-bold text-gray-900">{user.email}</span>
                          </div>
                          {user.isVerified && <Shield className="w-4 h-4 text-green-500" />}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                       {editing ? (
                         <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+250 78x xxx xxx" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all" />
                       ) : (
                         <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <Phone className="w-5 h-5 text-gray-300" />
                            <span className="font-bold text-gray-900">{user.phone || 'No phone added'}</span>
                         </div>
                       )}
                    </div>
                  </div>
               </div>

               {editing && (
                 <div className="mt-12">
                   <button onClick={handleSave} disabled={loading} className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-sm">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Profile Updates
                   </button>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-tight">Recent Login</h3>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today at 10:45 AM</p>
                    <p className="text-[10px] text-gray-300 mt-1">Kigali, Rwanda · Chrome on Windows</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center"><Star className="w-5 h-5" /></div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-tight">Account Trust</h3>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Member</p>
                    <p className="text-[10px] text-gray-300 mt-1">Thank you for being part of Kwisoko</p>
                </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
