'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import toast from 'react-hot-toast';
import { CreditCard, Smartphone, Banknote, ShieldCheck, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalRwf, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'CARD' | 'CASH'>('MOMO');
  const [momoPhone, setMomoPhone] = useState('');

  if (items.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'MOMO' && !momoPhone) {
      toast.error('Please enter your MoMo phone number');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
      const orderItems = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
      const order = await orderService.create(orderItems);

      // 2. Initiate Payment
      await paymentService.initiate(order.id, paymentMethod, momoPhone);

      toast.success('Order placed successfully!');
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Payment Method</h2>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MOMO')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'MOMO' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'MOMO' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">MTN MoMo</p>
                      <p className="text-xs text-gray-500">Pay using Mobile Money</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'MOMO' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'MOMO' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>

                {paymentMethod === 'MOMO' && (
                  <div className="mt-3 px-1 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">MoMo Phone Number</label>
                    <input
                      type="text"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      placeholder="078XXXXXXX"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'CARD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Credit / Debit Card</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'CARD' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'CASH' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'CASH' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'CASH' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'CASH' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 italic text-sm text-gray-500 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              Your payment is secure and protected by Kwisoko Escrow system.
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-600 flex-1 line-clamp-1">{item.quantity}x {item.title}</span>
                    <span className="font-semibold text-gray-900">{(item.priceRwf * item.quantity).toLocaleString()} RWF</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-8">
                <span>Total</span>
                <span className="text-blue-600">{totalRwf().toLocaleString()} RWF</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Order'}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
