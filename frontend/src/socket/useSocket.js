import { useContext } from "react";
import { SocketContext } from "./SocketContext";


// Custom hook for easy access
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
