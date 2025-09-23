import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import getSocket from '@/lib/socket';
import { addNotification } from '@/store/notificationSlice';
import NotificationBell from '../../AllUser_Profile/Notification/NotificationBell';

const Chat_ = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Generic notification from server
    const onNotification = (payload) => {
      // ensure id exists
      const id = payload?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      dispatch(addNotification({ id, ...payload }));
    };

    // Also listen to direct_message to show a notification
    const onDirectMessage = (msg) => {
      const from = msg?.sender?._id || msg?.sender?.id || msg?.sender;
      const title = `New message from ${msg?.sender?.name || 'User'}`;
      const body = msg?.content || 'Sent a message';
      const id = `msg-${msg?._id || msg?.id || Date.now()}`;
      dispatch(addNotification({ id, type: 'message', title, body, data: { from, messageId: msg?._id || msg?.id } }));
    };

    socket.on('notification', onNotification);
    socket.on('direct_message', onDirectMessage);

    return () => {
      socket.off('notification', onNotification);
      socket.off('direct_message', onDirectMessage);
    };
  }, [dispatch]);

  return (
    <div className="">
      <div className="flex justify-end">
        <NotificationBell />
      </div>
    
    </div>
  );
};

export default Chat_;