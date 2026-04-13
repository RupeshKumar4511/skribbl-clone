import {  useMemo } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext"; 

export const SocketProvider = ({ children }) => {
  // Memoize the socket so it's only created once
  const socket = useMemo(() => io("https://skribbl-clone-backend-ydwn.onrender.com"), []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};