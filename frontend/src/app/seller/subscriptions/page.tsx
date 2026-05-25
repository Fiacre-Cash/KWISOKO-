'use client';
import { useState, useEffect } from 'react';
import { Check, Loader2, Zap, Rocket, Star, ShieldCheck } from 'lucide-react';
import { subscriptionService } from '@/services/subscription.service';
import toast from 'react-hot-toast';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Seller',
    price: 'Free',
    features: ['Up to 10 products', 'Basic analytics', 'Direct chat'],
    color: 'bg-gray-50',
    icon: <Star className="w-6 h-6 text-gray-500" />
  },
  {
    id: 'pro',
    name: 'Pro Seller',
    price: '15,000 RWF',
    period: '/month',
    features: ['Unlimited products', 'Advanced analytics', 'Priority support', 'Featured listings (3)'],
    color: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    popular: true
  },
  {
    id: 'premium',
    name: 'Business Elite',
    price: '40,000 RWF',
    period: '/month',
    features: ['Everything in Pro', 'Custom business page', 'Verified badge', 'Featured listings (10)', 'Bulk import'],
    color: 'bg-purple-50',
    icon: <Rocket className="w-6 h-6 text-purple-600" />
  }
];

export default function SubscriptionPage() {
  const [activeSub, setActiveSub] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    subscriptionService.activeSubscription()
      .then(setActiveSub)
      .finally(() => setLoadingSub(false));
  }, []);

  const handleSubscribe = async (planId: string) => {
    setLoadingAction(planId);
    try {
      const res = await subscriptionService.subscribe(planId);
      setActiveSub(res);
      toast.success(`Successfully subscribed to ${planId.toUpperCase()} plan!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoadingAction(null);
    }
  };

  if (loadingSub) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-500 mt-1">Upgrade your business visibility and capabilities</p>
        </div>
        {activeSub && (
          <div className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Active Plan</p>
              <p className="font-bold text-gray-900 capitalize">{activeSub.plan}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col p-8 rounded-3xl border transition-all ${
              plan.popular ? 'border-blue-600 shadow-xl shadow-blue-100 scale-105 z-10' : 'border-gray-100 shadow-sm hover:shadow-md'
            } ${plan.color}`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </span>
            )}
            
            <div className="mb-6">{plan.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-gray-500 font-medium">{plan.period}</span>}
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={activeSub?.plan === plan.id || loadingAction !== null}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeSub?.plan === plan.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                  : plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {loadingAction === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               activeSub?.plan === plan.id ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
