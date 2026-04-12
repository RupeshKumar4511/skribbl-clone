import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import PlayerList from "../components/PlayerList";
import Logo from "../components/Logo";
import { useSocket } from "../socket/socket.js";
import { useEffect } from "react";

export default function Game() {
    const { roomId } = useParams();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const joinRoom = () => {
            socket.emit('join_room', {
                roomId,
                username: socket.id?.substring(0, 5) || "Guest"
            });
        };

        // If already connected, join immediately
        if (socket.connected) {
            joinRoom();
        } else {
            // Otherwise, wait for connection
            socket.on('connect', joinRoom);
        }

        return () => {
            // Leave the room instead of disconnecting the whole socket
            socket.emit('leave_room', { roomId });
            socket.off('connect', joinRoom);
        };
    }, [socket, roomId]);


    return (
        <div>
            <div className="w-full max-w-75 md:max-w-112.5">
                <Logo />
            </div>
            <h2 className="w-full flex justify-center text-red-400"><span className="text-white px-2">Share Room Link : </span>  {window.location.href}</h2>
            <div className="flex justify-between w-full min-h-14 bg-white my-2 px-10 py-3">
                <div>Timer</div>
                <p>Guess the word for the picture drawn in canvas below</p>
                <div>Setting</div>
            </div>
            <div className="flex flex-col">
                <div className="flex justify-evenly">
                    <PlayerList roomId={roomId} />
                    <Canvas roomId={roomId} />
                    <Chat roomId={roomId} />
                </div>
            </div>
        </div>
    );
}