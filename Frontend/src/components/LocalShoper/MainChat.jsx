import { EllipsisVertical, Paperclip, Send } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentChats,
  fetchDirectMessages,
  sendDirectMessage,
  addMessage,
  DeleteSingleMessage,
} from "../../store/chatSlice";
import getSocket from "@/lib/socket";
import { formatMessageTime } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
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
  
  //deleting the chat
   const MessageDeleteHandler = (MessageId) => {
   
    dispatch(DeleteSingleMessage(MessageId));
  };
  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchRecentChats());
  }, []);

  // Fetch messages when a user is selected

  useEffect(() => {
   
    if (selectedFriendId) {
      dispatch(fetchDirectMessages(selectedFriendId));
    }
  }, [dispatch, selectedFriendId]);

  // Use prop messages if provided; otherwise use chat slice
  const messages = useMemo(() => {
    if (propMessages && propMessages.length > 0) return propMessages;
    return chatMessages;
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

  // Socket.IO: join room and listen for incoming direct messages and user status updates
  useEffect(() => {
    const socket = getSocket();
    if (!currentUserId) return;

    // Join personal room
    socket.emit("join", String(currentUserId));

    // Handle incoming message only if it belongs to the open conversation
    const handleDirectMessage = (msg) => {
      try {
        const senderId = msg?.sender?._id || msg?.sender?.id || msg?.sender;
        const receiverId =
          msg?.receiver?._id || msg?.receiver?.id || msg?.receiver;

        // If current chat is with the sender (incoming) or with the receiver (if server echoes), add to view
        const inCurrentChat =
          (selectedFriendId && String(senderId) === String(selectedFriendId)) ||
          (selectedFriendId && String(receiverId) === String(selectedFriendId));

        if (inCurrentChat) {
          dispatch(addMessage(msg));
        }
      } catch (_) {
        // no-op
      }
    };

    // Handle user status updates
    const handleUserStatus = ({ userId, isOnline }) => {
      if (String(userId) === String(selectedFriendId)) {
        dispatch(updateFriendStatus({ userId, isOnline }));
      }
    };

    socket.on("direct_message", handleDirectMessage);
    socket.on("userStatus", handleUserStatus);

    return () => {
      socket.off("direct_message", handleDirectMessage);
      socket.off("userStatus", handleUserStatus);
    };
  }, [currentUserId, selectedFriendId, dispatch]);

  const headerInitial = (selectedFriend?.name || selectedFriend?.email || "U")
    ?.slice(0, 1)
    ?.toUpperCase();
  const isOnline = selectedFriend?.isOnline || false;

 

  return (
    <section className="relative h-full w-full flex flex-col min-h-0">
      <div className="h-full flex flex-col min-h-0">
        {/* Header with selected user's info */}
        <div className="h-16 border-b border-gray-200 bg-white flex items-center gap-3 px-4">
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
                  <span className="font-medium text-gray-900 text-sm">
                    {selectedFriend?.name || "Unnamed"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                  <EllipsisVertical className="relative r-0 w-3" />
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
          className="flex-1 min-h-0 flex flex-col gap-2 p-4 pb-24 overflow-y-auto "
        >
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
                  className={`relative max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow whitespace-pre-wrap break-words ${
                    isSender
                      ? "bg-white pr-28 text-gray-900 border border-gray-200 "
                      : "bg-[var(--two3m)] pr-18 text-white"
                  }`}
                >
                  {m?.content || ""}
                  <div className="flex items-center gap-1 absolute right-2 bottom-1">
                    <span
                      className={`text-[11px] ${
                        isSender ? "text-gray-500" : "text-gray-200"
                      }`}
                    >
                      {formatMessageTime(m?.createdAt)}
                    </span>
                    {isSender && (
                      <div className="flex">
                        <span
                          className={`text-xs ${
                            m?.isRead ? "text-blue-500" : "text-gray-400"
                          }`}
                        >
                          ✓{m?.isRead ? "✓" : ""}
                        </span>
                      </div>
                    )}

                    <span>
                      <Popover>
                        <PopoverTrigger>
                          {" "}
                          <EllipsisVertical className="cursor-pointer relative r-0 w-3" />
                        </PopoverTrigger>
                        <PopoverContent className="border-none text-[var(--two5m)] bg-[var(--two2m)] flex flex-col m-0 p-0 rounded-2xl">
                          <Button
                            onClick={()=>MessageDeleteHandler(m._id)}
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
            );
          })}
          {messages.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8">
              {selectedFriend
                ? "No messages yet"
                : "Pick a user from the list on the left"}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="absolute w-full bottom-4 flex justify-center items-center gap-2 px-4">
          <button
            type="button"
            className="bg-white h-10 w-10 flex items-center justify-center rounded-md shadow border border-gray-200"
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
                if (selectedFriendId && input.trim().length > 0) {
                  dispatch(
                    sendDirectMessage({
                      recipientId: selectedFriendId,
                      content: input.trim(),
                    })
                  );
                  setInput("");
                }
              }
            }}
            className="bg-white w-full px-4 outline-0 shadow h-10 rounded-md border border-gray-200"
            placeholder={
              selectedFriend
                ? "Type a message..."
                : "Select a user to start chatting"
            }
            disabled={!selectedFriendId}
          />
          <button
            type="button"
            onClick={() => {
              if (selectedFriendId && input.trim().length > 0) {
                dispatch(
                  sendDirectMessage({
                    recipientId: selectedFriendId,
                    content: input.trim(),
                  })
                );
                setInput("");
              }
            }}
            disabled={!selectedFriendId || input.trim().length === 0}
            className="h-10 w-10 flex items-center justify-center rounded-md bg-[var(--two3m)] text-white shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainChat;
