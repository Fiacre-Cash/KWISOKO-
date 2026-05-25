'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ArrowLeft, Camera, Loader2, Save, X } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<any[]>([]); // { url, isExisting, id? }
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceRwf: 0,
    categoryId: '',
    stock: 10,
    location: 'Kigali',
  });

  useEffect(() => {
    Promise.all([
      categoryService.getAll(),
      productService.getOne(id)
    ]).then(([cats, prod]) => {
      setCategories(cats);
      setFormData({
        title: prod.title,
        description: prod.description,
        priceRwf: prod.priceRwf,
        categoryId: prod.categoryId,
        stock: prod.stock,
        location: prod.location,
      });
      setPreviews(prod.images.map((img: any) => ({ url: img.url, isExisting: true, id: img.id })));
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load product');
      router.push('/seller/dashboard');
    });
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previews.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
    const newPreviews = files.map(f => ({ url: URL.createObjectURL(f), isExisting: false }));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const preview = previews[index];
    if (preview.isExisting) {
        // In a real app, we might call an API to delete the image from server
        // For now, we'll just filter it out from the display
    }
    setPreviews(previews.filter((_, i) => i !== index));
    if (!preview.isExisting) {
        setImages(images.filter((_, i) => {
            const fileIndex = previews.filter((p, pi) => !p.isExisting && pi < index).length;
            return i !== fileIndex;
        }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await productService.update(id, formData);
      if (images.length > 0) {
        await productService.uploadImages(id, images);
      }
      toast.success('Product updated successfully!');
      router.push('/seller/dashboard');
    } catch {
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
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
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/seller/dashboard" className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Edit Product</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none bg-gray-50/30 font-medium"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none bg-gray-50/30 font-sans"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Product Images (Up to 5)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {previews.map((p, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                      <Image src={p.url} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {p.isExisting && <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-md">LIVE</div>}
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all text-gray-400">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold">ADD PHOTO</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price (RWF)</label>
                <input
                  required
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none bg-gray-50/30 text-lg font-black text-blue-600"
                  value={formData.priceRwf}
                  onChange={e => setFormData({ ...formData, priceRwf: Number(e.target.value) })}
                />
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
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              SAVE CHANGES
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
