import { Children } from "react";
import { createContext,useEffect,useState,useContext } from "react";
import { socket } from "../lib/socket";

const Socketcontext = createContext(null);

const SocketProvider = ({children})=>{
const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    

    const onConnect = () => {
      console.log("Socket → Connected");
      setIsConnected(true);
    };

    const onDisconnect = (reason) => {
      console.log("Socket → Disconnected:", reason);
      setIsConnected(false);
    };

    const onConnectError = (err) => {
      console.log("Socket → Connection error:", err.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // Auto-connect strategy (most common in 2025-2026 apps)
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      // Do NOT disconnect here unless you really want to!
      // socket.disconnect();
    };
  }, []);

  return (
    <Socketcontext.Provider value={{ socket, isConnected }}>
      {children}
    </Socketcontext.Provider>
  );

}
export default SocketProvider;

export const useSocket = ()=>{
const context = useContext(Socketcontext);
if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
