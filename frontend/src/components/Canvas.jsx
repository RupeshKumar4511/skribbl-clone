import { useRef, useEffect } from "react";
import { useSocket } from "../socket/socket";

export default function Canvas() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const socket = useSocket()

  useEffect(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";


    const handleRemoteStart = ({ x, y }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleRemoteMove = ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    // Ensure these names match what your SERVER broadcasts
    socket.on("draw_start", handleRemoteStart);
    socket.on("draw_move", handleRemoteMove);

    return () => {
      socket.off("draw_data");
      socket.off("draw_move")
    };
  }, [socket]);

  const startDrawing = (e) => {
     drawing.current = true;
    const { x, y } = getCoordinates(e);
    
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);

    socket.emit("draw_start", { x, y });
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const { x, y } = getCoordinates(e);

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit("draw_move", { x, y });
  };
  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };


  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={400}
      className="border-2 border-black color-black bg-zinc-200 rounded-md"
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
    />
  );
}