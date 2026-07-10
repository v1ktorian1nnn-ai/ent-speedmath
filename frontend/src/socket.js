import { io } from "socket.io-client";
import { api } from "./api/client";

let socket = null;

export function getSocket() {
  if (socket) return socket;

  const token = localStorage.getItem("token");
  socket = io(api.API_URL, {
    auth: { token },
    autoConnect: false,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
