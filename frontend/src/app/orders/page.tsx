'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { orderService } from '@/services/order.service';
import { format } from 'date-fns';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CONFIRMED': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8">You haven't placed any orders. Start exploring products!</p>
            <Link href="/products" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium text-gray-700">{order.status}</span>
                      <span className="text-gray-300 mx-1">•</span>
                      <span className="text-sm font-bold text-blue-600">{order.totalRwf.toLocaleString()} RWF</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right mr-4">
                    <p className="text-xs text-gray-400">Total Items</p>
                    <p className="text-sm font-bold text-gray-900">{order.items.length}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
