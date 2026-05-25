'use client';
import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, Package, 
  ArrowUpRight, ArrowDownRight, Calendar, Loader2 
} from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';

export default function SellerAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getSellerStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  const cards = [
    { label: 'Total Revenue', value: `${stats.totalRevenueRwf?.toLocaleString()} RWF`, icon: DollarSign, color: 'bg-green-500', trend: '+12.5%' },
    { label: 'Total Sales', value: stats.totalSales, icon: ShoppingBag, color: 'bg-blue-600', trend: '+5.2%' },
    { label: 'Active Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-600', trend: '0%' },
    { label: 'Store Views', value: '1,284', icon: Users, color: 'bg-orange-500', trend: '+18.1%' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Store Analytics</h1>
          <p className="text-gray-500 mt-1">Track your business performance and growth</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">Last 30 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-${card.color.split('-')[1]}-100`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
              <span className={`text-xs font-bold flex items-center ${card.trend.startsWith('+') ? 'text-green-500' : 'text-gray-400'}`}>
                {card.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : null}
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Recent Sales</h3>
            <button className="text-sm text-blue-600 font-bold hover:underline">View All Report</button>
          </div>
          <div className="space-y-6">
            {stats.recentOrders?.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-bold text-gray-400">
                    {order.buyer?.firstName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{order.buyer?.firstName} {order.buyer?.lastName}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.totalRwf?.toLocaleString()} RWF</p>
                  <p className="text-xs text-green-500 font-bold uppercase">{order.status}</p>
                </div>
              </div>
            ))}
            {!stats.recentOrders?.length && <p className="text-gray-500 text-center py-10 italic">No sales recorded yet</p>}
          </div>
        </div>

        <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-100 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4 leading-tight">Growth Tip</h3>
          <p className="text-blue-100 text-sm leading-relaxed mb-8">
            Sellers with **Pro Plan** get 4x more views and 2.5x more sales on average. Boost your products today!
          </p>
          <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-95">
            Upgrade Store
          </button>
        </div>
      </div>
    </div>
  );
}
