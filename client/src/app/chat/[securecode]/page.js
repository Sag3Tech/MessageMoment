"use client";
import { ChatHeader } from "@/components/chat/header";
import MessageBox from "@/components/chat/messagesBox";
import SideCookieModal from "@/components/home/sideCookieModal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Chat() {
  const { securecode } = useParams();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io(process.env.NEXT_PUBLIC_BASE_URL);
    setSocket(socket);

    // Join the room when the component mounts
    socket.emit("joinRoom", securecode, "username", securecode);
    socket.on("roomJoined", (data) => {
      console.log("Room joined:", data);
      setIsConnected(true);
    });

    // Listen for userJoined event
    socket.on("userJoined", (data) => {
      console.log("User joined:", data);
    });

    // Listen for receiveMessage event
    socket.on("receiveMessage", (data) => {
      console.log("New message:", data);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [securecode]);

  return (
    <>
      <ChatHeader secureCode={securecode} />
      <MessageBox />
      <SideCookieModal />
    </>
  );
}

export default Chat;
