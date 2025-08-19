import { Paperclip, Send } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecentChats, fetchDirectMessages, sendDirectMessage } from '../../store/chatSlice'

// Simple chat view
// - Sender (current user) messages on LEFT
// - Receiver messages on RIGHT
const MainChat = ({ messages: propMessages = [] }) => {
  const dispatch = useDispatch()
  const authUser = useSelector((s) => s.auth?.user || null)
  const currentUserId = authUser?._id || authUser?.id
  const selectedFriend = useSelector((s) => s.auth?.selectedFriend || null)
  const selectedFriendId = useSelector((s) => s.auth?.selectedFriendId || null)
  const chatLoading = useSelector((s) => s.chat?.loading || false)
  const chatMessages = useSelector((s) => s.chat?.messages || [])
  const [input, setInput] = useState('')

  
  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchRecentChats());
  }, [dispatch]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedFriendId) {
      dispatch(fetchDirectMessages(selectedFriendId));
    }
  }, [dispatch, selectedFriendId]);

  // Use prop messages if provided; otherwise use chat slice
  const messages = useMemo(() => {
    const pm = Array.isArray(propMessages) ? propMessages : []
    const cm = Array.isArray(chatMessages) ? chatMessages : []
    return pm.length > 0 ? pm : cm
  }, [propMessages, chatMessages])

  // Chronological display (oldest -> newest)
  const displayMessages = useMemo(() => {
    const arr = Array.isArray(messages) ? [...messages] : []
    return arr.sort((a, b) => {
      const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0
      const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0
      return da - db
    })
  }, [messages])

  const headerInitial = (selectedFriend?.name || selectedFriend?.email || 'U')?.slice(0,1)?.toUpperCase()

  return (
    <section className='relative h-full w-full'>
<div>
      {/* Header with selected user's info */}
      <div className='h-16 border-b border-gray-200 bg-white flex items-center gap-3 px-4'>
        {selectedFriend ? (
          <>
            <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700'>
              {headerInitial}
            </div>
            <div className='flex flex-col'>
              <div className='font-medium text-gray-900 text-sm'>{selectedFriend?.name || 'Unnamed'}</div>
              <div className='text-xs text-gray-500'>{selectedFriend?.email || ''}</div>
            </div>
          </>
        ) : (
          <div className='text-sm text-gray-600'>Select a user to start chatting</div>
        )}
      </div>
      {/* Messages area */}
      <div className='flex flex-col gap-2 p-4 h-[calc(100%-4rem)] pb-24 overflow-y-auto'>
        {chatLoading && (
          <div className='text-center text-sm text-gray-500 py-4'>Loading messages...</div>
        )}
        {displayMessages.map((m) => {
          const senderId = m?.sender?._id || m?.sender?.id || m?.sender
          const isSender = currentUserId && senderId && String(senderId) === String(currentUserId)
          return (
            <div key={m?._id || m?.id} className={`flex w-full ${isSender ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm shadow ${isSender ? 'bg-white text-gray-900 border border-gray-200' : 'bg-[var(--two3m)] text-white'}`}>
                {m?.content || ''}
              </div>
            </div>
          )
        })}
        {displayMessages.length === 0 && (
          <div className='text-center text-sm text-gray-500 py-8'>
            {selectedFriend ? 'No messages yet' : 'Pick a user from the list on the left'}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className='absolute w-full bottom-4 flex justify-center items-center gap-2 px-4'>
        <button type='button' className='bg-white h-10 w-10 flex items-center justify-center rounded-md shadow border border-gray-200'>
          <Paperclip className='h-5 w-5 text-gray-700' />
        </button>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (selectedFriendId && input.trim().length > 0) {
                dispatch(sendDirectMessage({ recipientId: selectedFriendId, content: input.trim() }))
                setInput('')
              }
            }
          }}
          className='bg-white w-full px-4 outline-0 shadow h-10 rounded-md border border-gray-200'
          placeholder={selectedFriend ? 'Type a message...' : 'Select a user to start chatting'}
          disabled={!selectedFriendId}
        />
        <button
          type='button'
          onClick={() => {
            if (selectedFriendId && input.trim().length > 0) {
              dispatch(sendDirectMessage({ recipientId: selectedFriendId, content: input.trim() }))
              setInput('')
            }
          }}
          disabled={!selectedFriendId || input.trim().length === 0}
          className='h-10 w-10 flex items-center justify-center rounded-md bg-[var(--two3m)] text-white shadow disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Send className='h-5 w-5' />
        </button>
      </div>
    </div>
   

    </section>
  )
}

export default MainChat