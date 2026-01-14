// src/lib/socket.ts
import { io } from "socket.io-client";

const URL ="http://localhost:3003"

export const socket = io(URL, {
  autoConnect: false,              // We connect manually (recommended)
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  reconnectionDelayMax: 10000,
  randomizationFactor: 0.5,
  timeout: 10000,
  transports: ["websocket"],       // Most apps in 2026 prefer websocket first
  // withCredentials: true,        // uncomment if using cookies/auth
});
