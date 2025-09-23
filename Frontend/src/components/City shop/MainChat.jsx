import { Paperclip, Send } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentChats,
  fetchDirectMessages,
  sendDirectMessage,
  addMessage,
  DeleteSingleMessage,
} from "../../store/chatSlice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EllipsisVertical } from "lucide-react";
import getSocket from "@/lib/socket";
import { formatMessageTime } from "@/lib/utils";
import { Button } from "../ui/button";

// Simple chat view
// - Sender (current user) messages on LEFT
// - Receiver messages on RIGHT
const MainChat = ({ messages: propMessages = [] }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((s) => s.auth?.user || null);
  const currentUserId = authUser?._id || authUser?.id;
  const selectedFriend = useSelector((s) => s.auth?.selectedFriend || null);
  const selectedFriendId = useSelector((s) => s.auth?.selectedFriendId || null);
  const chatLoading = useSelector((s) => s.chat?.loading || false);
  const chatMessages = useSelector((s) => s.chat?.messages || []);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);
  const MessageDeleteHandler = (MessageId) => {
   
    dispatch(DeleteSingleMessage(MessageId));
  };
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
    const pm = Array.isArray(propMessages) ? propMessages : [];
    const cm = Array.isArray(chatMessages) ? chatMessages : [];
    return pm.length > 0 ? pm : cm;
  }, [propMessages, chatMessages]);

  // Chronological display (oldest -> newest)
  const displayMessages = useMemo(() => {
    const arr = Array.isArray(messages) ? [...messages] : [];
    return arr.sort((a, b) => {
      const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return da - db;
    });
  }, [messages]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [displayMessages, chatLoading]);

  // Socket.IO: join personal room and handle incoming messages
  useEffect(() => {
    const socket = getSocket();
    if (!currentUserId) return;

    // Join user's room
    socket.emit("join", String(currentUserId));

    const handleDirectMessage = (msg) => {
      try {
        const senderId = msg?.sender?._id || msg?.sender?.id || msg?.sender;
        const receiverId =
          msg?.receiver?._id || msg?.receiver?.id || msg?.receiver;
        const inCurrentChat =
          (selectedFriendId && String(senderId) === String(selectedFriendId)) ||
          (selectedFriendId && String(receiverId) === String(selectedFriendId));
        if (inCurrentChat) {
          dispatch(addMessage(msg));
        }
      } catch (_) {}
    };

    socket.on("direct_message", handleDirectMessage);
    return () => {
      socket.off("direct_message", handleDirectMessage);
    };
  }, [currentUserId, selectedFriendId, dispatch]);

  const headerInitial = (selectedFriend?.name || selectedFriend?.email || "U")
    ?.slice(0, 1)
    ?.toUpperCase();
  const isOnline = selectedFriend?.isOnline || false;

  const handleSendMessage = () => {
    if (selectedFriendId && input.trim().length > 0) {
      dispatch(
        sendDirectMessage({
          recipientId: selectedFriendId,
          content: input.trim(),
        })
      );
      setInput("");
    }
  };

  return (
    <section className="h-full w-full flex flex-col">
      {/* Header with selected user's info */}
      <div className="h-16 flex-shrink-0 border-b border-gray-200 bg-white flex items-center gap-3 px-4">
        {selectedFriend ? (
          <>
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                {headerInitial}
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {selectedFriend?.name || "User"}
                </span>
                <span className="text-xs text-gray-500">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-600">
            Select a user to start chatting
          </div>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4"
      >
        <div className="flex flex-col gap-2">
          {chatLoading && (
            <div className="text-center text-sm text-gray-500 py-4">
              Loading messages...
            </div>
          )}
          {displayMessages.map((m) => {
            const senderId = m?.sender?._id || m?.sender?.id || m?.sender;
            const isSender =
              currentUserId &&
              senderId &&
              String(senderId) === String(currentUserId);
            return (
              <div
                key={m?._id || m?.id}
                className={`flex w-full ${
                  isSender ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`relative max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow ${
                    isSender
                      ? " bg-white pr-18 text-gray-900 border border-gray-200"
                      : " bg-[var(--two3m)] pr-18 text-white"
                  }`}
                >
                  {m?.content || ""}
                  <div className="flex gap-10 m-0 p-0">
                    <span className="text-[11px] text-gray-500">
                      {formatMessageTime(m?.createdAt)}
                    </span>
              <div className="flex items-center gap-3 py-2 absolute right-2 bottom-1">
                     <p>
                     {isSender && (
                      <span
                        className={`text-xs ${
                          m?.isRead ? "text-blue-500" : "text-gray-400"
                        }`}
                      >
                        ✓{m?.isRead ? "✓" : ""}
                      </span>
                    )}
                   </p>
                    <span>
                      <Popover>
                        <PopoverTrigger>
                          {" "}
                          <EllipsisVertical className="cursor-pointer relative r-0 w-3" />
                        </PopoverTrigger>
                        <PopoverContent className="border-none text-[var(--two5m)] bg-[var(--two2m)] flex flex-col m-0 p-0 rounded-2xl">
                          <Button
                            onClick={() => MessageDeleteHandler(m._id)}
                            className="cursor-pointer"
                          >
                            Delete
                          </Button>
                          <Button className="cursor-pointer">Edit</Button>
                        </PopoverContent>
                      </Popover>
                    </span>
              </div>
                  </div>
                </div>
              </div>
            );
          })}
          {displayMessages.length === 0 && !chatLoading && (
            <div className="text-center text-sm text-gray-500 py-8">
              {selectedFriend
                ? "No messages yet"
                : "Pick a user from the list on the left"}
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 w-full max-w-3xl mx-auto">
          <button
            type="button"
            className="bg-white h-10 w-10 flex items-center justify-center rounded-md shadow border border-gray-200 flex-shrink-0"
          >
            <Paperclip className="h-5 w-5 text-gray-700" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="bg-white w-full px-4 outline-0 shadow h-10 rounded-md border border-gray-200"
            placeholder={
              selectedFriend
                ? "Type a message..."
                : "Select a user to start chatting"
            }
            disabled={!selectedFriendId || chatLoading}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={
              !selectedFriendId || input.trim().length === 0 || chatLoading
            }
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-md bg-[var(--two3m)] text-white shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainChat;
