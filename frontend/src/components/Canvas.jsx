import { useRef, useEffect, useState } from "react";
import { useSocket } from "../socket/socket.js";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const socket = useSocket();
  const [isErasing, setIsErasing] = useState(false); // Toggle state

  useEffect(() => {
    if (!socket || !roomId) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setupCtx = (mode) => {
      ctx.lineWidth = mode === "erase" ? 20 : 3; // Eraser is usually thicker
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000000";
      // "destination-out" makes the brush transparent (erases)
      ctx.globalCompositeOperation = mode === "erase" ? "destination-out" : "source-over";
    };

    const handleRemoteStart = ({ x, y, mode }) => {
      setupCtx(mode);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleRemoteMove = ({ x, y, mode }) => {
      setupCtx(mode);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    socket.on("draw_start", handleRemoteStart);
    socket.on("draw_move", handleRemoteMove);

    return () => {
      socket.off("draw_start", handleRemoteStart);
      socket.off("draw_move", handleRemoteMove);
    };
  }, [socket, roomId]);

  const startDrawing = (e) => {
    drawing.current = true;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    
    const mode = isErasing ? "erase" : "draw";
    // Apply local styles before emitting
    ctx.lineWidth = isErasing ? 20 : 3;
    ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    socket.emit("draw_start", { x, y, roomId, mode });
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    
    ctx.lineTo(x, y);
    ctx.stroke();
    socket.emit("draw_move", { x, y, roomId, mode: isErasing ? "erase" : "draw" });
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div className="flex flex-col gap-2">
      

      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        className="border-2 border-black bg-white rounded-md cursor-crosshair shadow-lg"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
      />

      <div className="flex gap-4 mb-2">
        <button 
          onClick={() => setIsErasing(false)}
          className={`px-4 py-1 rounded ${!isErasing ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          ✏️ Pencil
        </button>
        <button 
          onClick={() => setIsErasing(true)}
          className={`px-4 py-1 rounded ${isErasing ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          🧽 Eraser
        </button>
      </div>
    </div>
  );
}
