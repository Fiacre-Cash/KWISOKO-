'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Store, CheckCircle } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useAuthStore } from '@/store/auth.store';
import api from '@/services/api';
import LocationSelect from '@/components/LocationSelect';

const schema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  description: z.string().optional(),
  location: z.string().min(2, 'Location required'),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const benefits = [
  'Free to register and apply',
  'Reach buyers across East Africa',
  'Secure payment processing',
  'Dedicated seller dashboard',
  'Admin support team',
];

export default function SellerApplyPage() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setLoading(true);
    try {
      await api.post('/sellers/apply', data);
      toast.success('Application submitted! We will review it shortly.');
      router.push('/seller/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left — Benefits */}
          <div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-5">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Start Selling on Kwisoko</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Join thousands of verified sellers across Rwanda and East Africa. Reach more buyers, grow your business, and get paid securely.
            </p>
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium">📋 What happens next?</p>
              <ol className="mt-2 space-y-1 text-sm text-blue-700 list-decimal list-inside">
                <li>Submit your application below</li>
                <li>Our team reviews within 24–48 hours</li>
                <li>Get approved and access your dashboard</li>
                <li>Upload products and start selling</li>
              </ol>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Form</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name *</label>
                <input {...register('businessName')} placeholder="e.g. JP Electronics Kigali" className="input" />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Location *</label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <LocationSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="📍 Select your city"
                      required
                    />
                  )}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Phone (optional)</label>
                <input {...register('phone')} placeholder="+250 780 000 000" className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Description (optional)</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Tell buyers what you sell and why they should choose you..."
                  className="input resize-none"
                />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By applying, you agree to our seller terms and conditions.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
