import { createContext, useMemo } from "react";
import { io } from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  // Memoize the socket so it's only created once
  const socket = useMemo(() => io("https://skribbl-clone-backend-ydwn.onrender.com"), []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};