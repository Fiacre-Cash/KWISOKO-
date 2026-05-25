'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Loader2, CheckCircle } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    // Simulate sending (replace with real API call)
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email Us',
      value: 'support@kwisoko.rw',
      sub: 'We reply within 24 hours',
      color: 'bg-blue-50 text-blue-600',
      href: 'mailto:support@kwisoko.rw',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Call Us',
      value: '+250 788 000 000',
      sub: 'Mon–Fri, 8am–6pm CAT',
      color: 'bg-green-50 text-green-600',
      href: 'tel:+250788000000',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'WhatsApp',
      value: '+250 788 000 000',
      sub: 'Chat with us directly',
      color: 'bg-emerald-50 text-emerald-600',
      href: 'https://wa.me/250788000000',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Visit Us',
      value: 'KG 7 Ave, Kigali',
      sub: 'Gasabo, Kigali, Rwanda',
      color: 'bg-orange-50 text-orange-600',
      href: 'https://maps.google.com/?q=Kigali,Rwanda',
    },
  ];

  const faqs = [
    {
      q: 'How do I become a seller on Kwisoko?',
      a: 'Register an account, then go to "Become a Seller" and fill in your business details. Our team reviews applications within 24–48 hours.',
    },
    {
      q: 'How do I pay for a product?',
      a: 'We support MTN Mobile Money, Airtel Money, and card payments. You can also arrange cash on delivery with the seller.',
    },
    {
      q: 'Is my payment secure?',
      a: 'Yes. All payments are processed through secure, encrypted channels. We never store your card details.',
    },
    {
      q: 'What if I have a problem with a seller?',
      a: 'Use the "Report" button on any product or seller profile. Our admin team reviews all reports within 24 hours.',
    },
    {
      q: 'Can I sell from outside Rwanda?',
      a: 'Yes! Kwisoko supports sellers from across East Africa including Uganda, Kenya, Tanzania, Burundi, and DRC.',
    },
    {
      q: 'How do I track my order?',
      a: 'After placing an order, go to "My Orders" in your account. You can also chat directly with the seller for updates.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-600 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-blue-200 text-lg">
            Have a question, issue, or feedback? We're here to help. Reach out and we'll get back to you quickly.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-14 w-full">

        {/* Contact Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {contactInfo.map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
              className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-blue-100 transition-all text-center">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
              <p className="font-bold text-gray-900 text-sm">{item.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in the form and we'll respond within 24 hours.</p>

            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Thank you for reaching out. We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-5 btn-primary px-6 py-2.5 text-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alice Uwase"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alice@example.com"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input"
                  >
                    <option value="">Select a topic...</option>
                    <option value="seller-application">Seller Application</option>
                    <option value="payment-issue">Payment Issue</option>
                    <option value="report-scam">Report a Scam</option>
                    <option value="account-help">Account Help</option>
                    <option value="product-issue">Product Issue</option>
                    <option value="partnership">Partnership / Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    className="input resize-none"
                    required
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm mb-6">Quick answers to common questions.</p>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 text-sm list-none hover:bg-gray-100 transition-colors">
                    {faq.q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg ml-3 flex-shrink-0">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            {/* Office Hours */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <p className="font-semibold text-blue-900 text-sm">Support Hours</p>
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-medium">8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">9:00 AM – 3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-blue-400">Closed</span>
                </div>
                <p className="text-xs text-blue-600 mt-2">All times in Central Africa Time (CAT, UTC+2)</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
