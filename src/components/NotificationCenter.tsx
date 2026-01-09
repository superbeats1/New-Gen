import React, { useState, useRef, useEffect } from 'react';
import { Bell, Clock, Zap } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // TODO: Navigate to notification detail based on type
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/5 rounded-xl transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-[500px] bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-violet-600/5 to-transparent">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Alerts</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
                <p className="text-slate-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left transition-all hover:bg-white/5 ${
                      !notification.isRead ? 'bg-violet-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'alert_result' ? 'bg-violet-500/10' : 'bg-blue-500/10'
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          notification.type === 'alert_result' ? 'text-violet-400' : 'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        {notification.message && (
                          <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 text-[10px] text-slate-600">
                          <Clock className="w-3 h-3" />
                          <span>{getRelativeTime(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
              <button
                onClick={() => {
                  // TODO: Navigate to full alert history
                  setIsOpen(false);
                }}
                className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors py-2"
              >
                View all alerts →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
