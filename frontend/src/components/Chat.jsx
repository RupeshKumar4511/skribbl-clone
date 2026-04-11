import { useEffect, useState } from "react";
import { useSocket } from "../socket/socket";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const socket = useSocket()
  const [chats,setChats] = useState([])

  useEffect(() => {
    socket.on('chat',(data)=>{
      setChats((prev)=>[...prev,data.text])
    })
  },[socket])

  const send = (event) => {
    event.preventDefault()
    if (!event.target.value) {
      socket.emit("chat", { text: msg });
      setMsg("");
      setChats((prev)=>[...prev,msg])
    }
  };

  return (
    <form className="flex flex-col bg-white w-70 rounded-md">
      <div className="px-2 min-h-85 flex flex-col justify-end">
        {chats.map((chat,index)=><p key={index}>{chat}</p>)}
      </div>
      <input
        placeholder="Type your guess here"
        value={msg}
        className="border-2 border-black/40 mx-1 rounded-md px-2"
        onChange={(e) => setMsg(e.target.value)}
      />
      <button type="submit" onClick={send} className="bg-blue-500 rounded-md px-2 w-20 m-2 text-white">Send</button>
    </form>
  );
}