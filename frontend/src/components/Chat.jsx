import { useEffect, useState, useRef } from "react";
import { useSocket } from "../socket/useSocket.js";

export default function Chat({ roomId }) {
  const [msg, setMsg] = useState("");
  const socket = useSocket();
  const [chats, setChats] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleChat = (data) => {
      // Store the full ID for logic, truncate in the UI
      setChats((prev) => [...prev, { id: data.id, text: data.text }]);
    };

    socket.on('chat', handleChat);

    // CLEANUP: This is critical to prevent duplicate listeners
    return () => {
      socket.off('chat', handleChat);
    };
  }, [socket, roomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const send = (event) => {
    event.preventDefault();
    if (msg.trim() !== "") {
      socket.emit("chat", { roomId, id: socket.id, text: msg });
      setChats((prev) => [...prev, { id: socket.id, text: msg }]);
      setMsg("");
    }
  };

  return (
    <form onSubmit={send} className="flex flex-col bg-white w-72 h-[400px] rounded-md border border-gray-200">
      <div 
        ref={chatContainerRef}
        className="px-2 flex-1 overflow-y-auto py-2 flex flex-col gap-1"
      >
        {chats.map((chat, index) => (
          <p key={index} className="text-sm">
            <span className={chat.id === socket.id ? "text-blue-500 font-bold" : "text-green-500 font-bold"}>
              {chat.id === socket.id ? "You" : `Player ${chat.id.substring(0, 5)}`}
            </span>
            : {chat.text}
          </p>
        ))}
      </div>
      
      <div className="p-2 border-t flex gap-1">
        <input
          placeholder="Type your guess..."
          value={msg}
          className="border border-black/20 flex-1 rounded-md px-2 py-1 text-sm outline-none focus:border-blue-500"
          onChange={(e) => setMsg(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 rounded-md px-3 py-1 text-white text-sm transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  );
}
