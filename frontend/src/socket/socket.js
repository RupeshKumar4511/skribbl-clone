import { useMemo } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  return useMemo(() => io("http://localhost:3000"), []);
};