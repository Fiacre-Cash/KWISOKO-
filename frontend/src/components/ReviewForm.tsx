'use client';
import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import toast from 'react-hot-toast';

interface Props {
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewService.create({ productId, rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">Leave a Review</h3>
      
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        className="w-full h-24 p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none text-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
      </button>
    </form>
  );
}
