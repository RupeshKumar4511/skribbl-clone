import { useState, useEffect, useRef } from 'react';
import { useSocket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

const LobbyMenu = () => {
  const canvasRef = useRef(null);

  // Customization State
  const [color, setColor] = useState('#00ffa2');
  const [eyes, setEyes] = useState(0);
  const [mouth, setMouth] = useState(0);

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const socket = useSocket()


  const randomize = () => {
    const colors = ['#ff1f1f', '#ff8c00', '#fff000', '#32ff00', '#00ffa2', '#4b00ff', '#ff69b4'];
    setColor(colors[Math.floor(Math.random() * colors.length)]);
    setEyes(Math.floor(Math.random() * 2));
    setMouth(Math.floor(Math.random() * 2));
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 200, 200);

    const x = 100, y = 80;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = color;

    // 1. Draw Body Silhouette
    ctx.beginPath();
    ctx.moveTo(x - 45, y + 80);
    ctx.quadraticCurveTo(x - 40, y + 40, x - 35, y + 35); // Left Shoulder
    ctx.arc(x, y, 40, Math.PI * 0.9, Math.PI * 0.1, false); // Head
    ctx.quadraticCurveTo(x + 40, y + 40, x + 45, y + 80); // Right Shoulder
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Draw Face
    ctx.fillStyle = '#000000';
    if (eyes === 0) { // Shades
      ctx.fillRect(x - 32, y - 12, 28, 18);
      ctx.fillRect(x + 4, y - 12, 28, 18);
    } else { // Dots
      ctx.beginPath();
      ctx.arc(x - 15, y - 5, 6, 0, Math.PI * 2);
      ctx.arc(x + 15, y - 5, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    ctx.beginPath();
    if (mouth === 0) { // Flat
      ctx.moveTo(x - 15, y + 22); ctx.lineTo(x + 15, y + 22);
    } else { // Smile
      ctx.arc(x, y + 15, 18, 0.1 * Math.PI, 0.9 * Math.PI);
    }
    ctx.stroke();

  }, [color, eyes, mouth]);

  useEffect(() => {
    socket.on("room_created", ({ roomId }) => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off("room_created");
    };
  }, [navigate, socket]);

  const createRoom = () => {
    socket.emit("create_room", { hostName: name || "User"});
  };

  const joinRoom = () => {
    socket.emit("join_room", { roomId, playerName: name  || "User"});
    navigate(`/game/${roomId}`);
  };

  return (
    <div className="bg-[#1a469d] flex items-center justify-center p-4 font-sans"
    >

      <div className="bg-[#1c3e89]/95 p-6 rounded-lg w-full max-w-[420px] shadow-2xl border border-blue-900/50">

        {/* Header Row */}
        <div className="flex gap-2 mb-6 bg-[#1c3e89]/95 ">
          <input
            type="text"
            placeholder="Enter your name"
            className="p-3 rounded text-lg font-bold outline-none border-none shadow-inner bg-white "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select className="w-1/3 p-3 rounded text-lg font-semibold border-none outline-none bg-white  cursor-pointer">
            <option>English</option>
          </select>
        </div>

        {/* Avatar Area */}
        <div className="relative flex items-center justify-center mb-6">
          <button onClick={randomize} className="absolute top-0 right-0 text-3xl hover:scale-110 transition-transform">🎲</button>

          {/* Left Arrows */}
          <div className="flex flex-col gap-1">
            {['eyes', 'mouth', 'color'].map((type) => (
              <span key={type} className="text-white text-4xl font-black cursor-pointer select-none drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:text-gray-300">
                {'<'}
              </span>
            ))}
          </div>

          <canvas ref={canvasRef} width="200" height="180" className="mx-4" />

          {/* Right Arrows */}
          <div className="flex flex-col gap-1">
            {['eyes', 'mouth', 'color'].map((type) => (
              <span key={type} className="text-white text-4xl font-black cursor-pointer select-none drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:text-gray-300">
                {'>'}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button className="w-full bg-[#55da33] hover:bg-[#4bc12d] text-white text-4xl font-bold py-3 rounded-lg border-b-[6px] border-[#3e9d25] transition-all active:border-b-0 active:translate-y-[4px]" onClick={joinRoom}>
            Play!
          </button>

          <button className="w-full bg-[#2b8ee4] hover:bg-[#257cc7] text-white text-xl font-bold py-3 rounded-lg border-b-[4px] border-[#1a5ea3] transition-all active:border-b-0 active:translate-y-[2px]" onClick={createRoom}>
            Create Private Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default LobbyMenu;
