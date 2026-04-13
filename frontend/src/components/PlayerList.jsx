import { useState, useEffect } from "react";
import { useSocket } from "../socket/useSocket.js";

export default function PlayerList({ roomId }) {
  const socket = useSocket();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!socket || !roomId) return;

    // 2. Listen for updates specifically for this room
    const handleUpdatePlayers = (userList) => {
      setPlayers(userList);
    };

    socket.on("update_player_list", handleUpdatePlayers);

    return () => {
      socket.off("update_player_list", handleUpdatePlayers);
    };
  }, [socket, roomId]);

  return (
    <div className="flex flex-col bg-white w-48 gap-2 rounded-md p-2 shadow-sm border border-gray-200">
      <div className="flex flex-col items-center border-b pb-1">
        <h1 className="font-bold text-blue-500">Players ({players.length})</h1>
        <p className="text-[10px] text-gray-400 font-mono uppercase">{roomId}</p>
      </div>
      
      <div className="flex flex-col gap-1 overflow-y-auto max-h-60">
        {players.map((player, index) => (
          <div 
            className={`flex justify-between px-2 py-1 border rounded-md ${
              player.id === socket.id ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-black/10"
            }`} 
            key={player.id}
          >
            <span className="text-gray-400 text-sm">#{index + 1}</span>
            <span className="truncate text-sm font-medium">
              {player.id === socket.id ? "You" : `Player ${player.id.substring(0, 4)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
