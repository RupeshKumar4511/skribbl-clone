import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import PlayerList from "../components/PlayerList";
import Logo from "../components/Logo";

export default function Game() {
    const { roomId } = useParams();

    return (
        <div>
            <div className="w-full max-w-75 md:max-w-112.5">
                <Logo />
            </div>
            <h2 className="w-full flex justify-center text-red-400"><span className="text-white px-2">Share Room Link : </span>  {window.location.href}</h2>
            <div className="flex justify-between w-full min-h-14 bg-white my-2 px-10 py-3">
                <div>Timer</div>
                <p>text to shown here</p>
                <div>Setting</div>
            </div>
            <div className="flex flex-col">
                <div className="flex justify-evenly">
                    <PlayerList />
                    <Canvas />
                    <Chat />
                </div>
            </div>
        </div>
    );
}