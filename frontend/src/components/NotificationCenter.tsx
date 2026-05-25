'use client';
import { useState, useEffect } from 'react';
import { Bell, BellRing, Check, Info, Package, DollarSign, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { notificationService } from '@/services/notification.service';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      const countRes = await notificationService.getUnreadCount();
      setUnreadCount(countRes.count);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async () => {
    try {
      await notificationService.markRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package className="w-4 h-4 text-blue-500" />;
      case 'PAYMENT': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'MESSAGE': return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'SYSTEM': return <Info className="w-4 h-4 text-blue-400" />;
      case 'REVIEW': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing className="w-6 h-6 animate-swing" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-red-200">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        ) : (
          <Bell className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-blue-50/30">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkRead}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-400 italic">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/20' : ''}`}
                    >
                      <div className="mt-1 w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-xs truncate ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                          {!n.isRead && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-1.5">{n.body}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-100/50">
              <button className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors">
                VIEW ALL HISTORY
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
