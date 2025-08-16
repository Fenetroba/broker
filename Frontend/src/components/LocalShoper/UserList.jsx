import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCityShopUsers,
  selectCityShopUsers,
  selectCityShopLoading,
  selectCityShopError,
  setSelectedUser
} from '../../store/AuthSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectCityShopUsers);
  const loading = useSelector(selectCityShopLoading); 
  const error = useSelector(selectCityShopError);
  const selectedFriendId = useSelector((s) => s.auth?.selectedFriendId || null);

  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCityShopUsers());
  }, [dispatch]);

  // Simple in-place filtering by name/email
  const q = query.trim().toLowerCase();
  const filtered = (users || []).filter(u => {
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
        placeholder="Find City Shop user"
      />

      {loading && <div className="p-3 text-sm text-gray-500">Loading users...</div>}
      {error && <div className="p-3 text-sm text-red-600">{String(error)}</div>}

      <div  className="flex flex-col max-h-[60vh] overflow-auto divide-y divide-gray-100 bg-white rounded-md">
        {(filtered || []).map((u) => {
          const uid = u?._id || u?.id;
          const isActive = selectedFriendId && uid && String(selectedFriendId) === String(uid);
          return (
            <div 
              onClick={()=>dispatch(setSelectedUser(u))}
              key={uid} 
              className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition cursor-pointer ${isActive ? 'bg-blue-50' : ''}`}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                {(u?.name || u?.email || 'U').slice(0,1).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-gray-900 text-sm line-clamp-1">{u?.name || 'Unnamed'}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{u?.email || ''}</div>
              </div>
            </div>
          );
        })}
        {(!filtered || filtered.length === 0) && !loading && (
          <div className="p-4 text-center text-sm text-gray-500">No City Shop users found</div>
        )}
      </div>
    </div>
  );
};

export default UserList;