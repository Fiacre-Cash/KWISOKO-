'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ArrowLeft, Camera, Loader2, Save, X } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceRwf: 0,
    categoryId: '',
    stock: 10,
    location: 'Kigali',
  });

  useEffect(() => {
    categoryService.getAll().then(setCategories);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return toast.error('Please select a category');
    
    setLoading(true);
    try {
      const product = await productService.create(formData);
      if (images.length > 0) {
        await productService.uploadImages(product.id, images);
      }
      toast.success('Product created successfully!');
      router.push('/seller/dashboard');
    } catch {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/seller/dashboard" className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Add New Product</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. iPhone 15 Pro Max, 256GB"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-4 focus:ring-blue-100 focus:outline-none focus:border-blue-300 bg-gray-50/30"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell buyers about your product. Include specs, condition, and why it's a great deal."
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-4 focus:ring-blue-100 focus:outline-none focus:border-blue-300 bg-gray-50/30 font-sans"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Product Images (Up to 5)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                      <Image src={src} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all text-gray-400 hover:text-blue-600">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold">ADD PHOTO</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
            </div>
          </div>

          {/* Pricing & Category */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price (RWF)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">RF</span>
                  <input
                    required
                    type="number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:outline-none bg-gray-50/30 text-lg font-black text-blue-600"
                    value={formData.priceRwf}
                    onChange={e => setFormData({ ...formData, priceRwf: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none bg-gray-50/30 text-sm font-medium"
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Stock Availability</label>
                <input
                  required
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none bg-gray-50/30 text-sm font-medium"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pick-up Location</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Nyarugenge, Kigali"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none bg-gray-50/30 text-sm font-medium"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              PUBLISH PRODUCT
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
