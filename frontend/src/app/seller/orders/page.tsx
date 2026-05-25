'use client';
import { useState, useEffect } from 'react';
import { Package, Search, Filter, ChevronRight, CheckCircle2, Truck, XCircle, Clock, Loader2 } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import { orderService } from '@/services/order.service';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    orderService.getSellerOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
      case 'SHIPPED': return 'bg-purple-100 text-purple-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Manage Orders</h1>
            <p className="text-gray-500 mt-1">Track and fulfill your customer purchases</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search orders..." className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <button className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50">
               <Filter className="w-4 h-4 text-gray-600" />
             </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider text-xs">Order & Buyer</th>
                  <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider text-xs">Items</th>
                  <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider text-xs">Total</th>
                  <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{order.buyer?.firstName} {order.buyer?.lastName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{format(new Date(order.createdAt), 'MMM dd, h:mm a')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      {order.totalRwf.toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                            disabled={updatingId === order.id}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Confirm Order"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            disabled={updatingId === order.id}
                            className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                            title="Mark as Shipped"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            disabled={updatingId === order.id}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Mark as Delivered"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                            disabled={updatingId === order.id}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-300 ml-2 mt-2" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
