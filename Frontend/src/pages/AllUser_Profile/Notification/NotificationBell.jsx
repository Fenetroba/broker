import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifications } from '@/store/notificationSlice';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.notifications?.items || []);
  const unread = items.filter((i) => !i.read).length;

  const handleClick = () => {
    // clear notifications when user clicks the bell
    dispatch(clearNotifications());
  };

  return (
    <div className="relative">
      <button aria-label="Notifications" className="cursor-pointer relative hover:bg-[var(--two3m)] rounded-full p-[2px]" onClick={handleClick}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-red-600 text-white">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;