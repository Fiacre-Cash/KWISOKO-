import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Kwisoko — Rwanda Marketplace',
  description: 'Buy and sell anything in Rwanda. Connect buyers and sellers across the country.',
  keywords: 'Rwanda marketplace, buy sell Rwanda, Kigali market, online shopping Rwanda',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-gray-50 text-gray-900 antialiased font-sans`}>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
