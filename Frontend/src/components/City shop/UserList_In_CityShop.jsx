// ...existing code...
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchLocalShopUsers,
  selectLocalShopUsers,
  selectLocalShopLoading,
  selectLocalShopError,
  setSelectedUser
} from '../../store/AuthSlice';
import Chat_ from '@/pages/AllUser_Profile/Notification/chat_';

const UserList_In_CityShop = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectLocalShopUsers);
  const loading = useSelector(selectLocalShopLoading); 
  const error = useSelector(selectLocalShopError);
  const selectedFriendId = useSelector((s) => s.auth?.selectedFriendId || null);

  const authUser = useSelector((s) => s.auth?.user || null);
  const currentUserId = authUser?._id || authUser?.id;

  const chatMessages = useSelector((s) => s.chat?.messages || []);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchLocalShopUsers());
  }, [dispatch]);

  // Build a map: otherUserId -> { message, time }
  const lastMessagesByUser = useMemo(() => {
    const map = {};
    if (!currentUserId || !Array.isArray(chatMessages)) return map;

    for (const m of chatMessages) {
      const senderId = m?.sender?._id || m?.sender?.id || m?.sender;
      const receiverId = m?.receiver?._id || m?.receiver?.id || m?.receiver;
      if (!senderId || !receiverId) continue;

      // only consider messages in conversations involving current user
      if (String(senderId) !== String(currentUserId) && String(receiverId) !== String(currentUserId)) continue;

      const otherId = String(senderId) === String(currentUserId) ? String(receiverId) : String(senderId);
      const time = new Date(m?.createdAt || m?.created_at || Date.now()).getTime();

      const prev = map[otherId];
      if (!prev || time > prev.time) {
        map[otherId] = { message: m, time };
      }
    }

    return map;
  }, [chatMessages, currentUserId]);

  const previewText = (text, len = 60) => {
    if (!text) return '';
    return text.length > len ? text.slice(0, len - 3) + '...' : text;
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Simple in-place filtering by name/email
  const q = query.trim().toLowerCase();
  const list = Array.isArray(users) ? users : [];
  const filtered = list.filter(u => {
    if (!q) return true;
    const name = (u?.name || '').toLowerCase();
    const email = (u?.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-8 bg-white rounded-[6px] px-2 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Find Local Shop user"
      />

      {loading && <div className="p-3 text-sm text-gray-500">Loading users...</div>}
      {error && <div className="p-3 text-sm text-red-600">{String(error)}</div>}

      <div  className="flex flex-col max-h-[60vh] overflow-auto divide-y divide-gray-100 bg-white rounded-md">
        {filtered.map((u) => {
          const uid = u?._id || u?.id;
          const isActive = selectedFriendId && uid && String(selectedFriendId) === String(uid);

          const lastEntry = lastMessagesByUser[String(uid)];
          const lastMsg = lastEntry?.message;
          const lastPreview = lastMsg ? previewText(lastMsg?.content || lastMsg?.text || '') : null;
          const lastTime = lastMsg ? formatTime(lastMsg?.createdAt || lastMsg?.created_at) : '';

          return (
            <div 
              onClick={()=>dispatch(setSelectedUser(u))}
              key={uid} 
              className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition cursor-pointer ${isActive ? 'bg-blue-50' : ''}`}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 overflow-hidden">
                {u?.profilePic ? (
                  <img src={u.profilePic} alt={u?.name || u?.email || 'User'} className="h-8 w-8 object-cover rounded-full" />
                ) : (
                  (u?.name || u?.email || 'U').slice(0,1).toUpperCase()
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-900 text-sm line-clamp-1">{u?.name || 'Unnamed'}</div>
                  <div className="text-xs text-gray-400">{lastTime}</div>

                  <Chat_/>
                </div>

                <div className="text-xs text-gray-500 line-clamp-1">
                  { lastPreview || 'No messages yet' }
                </div>
                
              </div>
            </div>
          );
        })}
        {(filtered.length === 0) && !loading && (
          <div className="p-4 text-center text-sm text-gray-500">No Local Shop users found</div>
        )}
      </div>
    </div>
  );
};

export default UserList_In_CityShop;
// ...existing code...