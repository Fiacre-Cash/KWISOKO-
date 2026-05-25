'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Package, Clock, CheckCircle2, Truck, CreditCard, Smartphone, Banknote, MapPin, ExternalLink } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { orderService } from '@/services/order.service';
import { format } from 'date-fns';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOne(params.id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
      <Footer />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link href="/orders" className="mt-4 text-blue-600 hover:underline">Back to My Orders</Link>
      </div>
      <Footer />
    </div>
  );

  const steps = [
    { label: 'Pending', status: 'PENDING', icon: Clock },
    { label: 'Confirmed', status: 'CONFIRMED', icon: CheckCircle2 },
    { label: 'Shipped', status: 'SHIPPED', icon: Truck },
    { label: 'Delivered', status: 'DELIVERED', icon: CheckCircle2 },
  ];

  const currentStep = steps.findIndex(s => s.status === order.status);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Link href="/orders" className="flex items-center gap-1 text-gray-500 hover:text-blue-600 mb-6 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Order Details</h1>
            <p className="text-gray-500">ID: <span className="font-mono">{order.id}</span> • {format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <Package className="w-4 h-4" /> {order.status}
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="relative flex justify-between">
            {/* Progress Bar */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 -z-0">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, i) => (
              <div key={step.status} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  i <= currentStep ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-2 border-gray-100 text-gray-300'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${i <= currentStep ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'}
                        alt={item.product?.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/products/${item.productId}`} className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1 truncate transition-colors">
                          {item.product?.title}
                        </Link>
                        <span className="font-bold text-gray-900 ml-4">{(item.priceRwf * item.quantity).toLocaleString()} RWF</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Quantity: {item.quantity}</p>
                      <Link href={`/chats/start/${item.product?.sellerId}`} className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                        Contact Seller <ChevronLeft className="w-3 h-3 rotate-180" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px bg-gray-100 my-6" />
              <div className="space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{order.totalRwf?.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="text-green-500 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">{order.totalRwf?.toLocaleString()} RWF</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              {order.payment ? (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                    {order.payment.method === 'MOMO' ? <Smartphone className="w-5 h-5" /> : 
                     order.payment.method === 'CARD' ? <CreditCard className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.payment.method}</p>
                    <p className={`text-xs font-semibold ${order.payment.status === 'SUCCESS' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.payment.status}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Payment info not available</p>
              )}
            </div>

            {/* Seller Contact Prompt */}
            <div className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Need help?
              </h3>
              <p className="text-sm text-blue-100 mb-4">Message seller directly for delivery updates or questions about products.</p>
              <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
