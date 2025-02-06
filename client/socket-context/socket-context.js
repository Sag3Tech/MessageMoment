"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

// Define the socket connection context
const SocketContext = createContext(null);

// Custom hook to use socket connection
export const useSocket = () => {
  return useContext(SocketContext);
};

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("Socket provider");
    // Establish socket connection when component mounts
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL, { secure: false }); // Replace with your server URL
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to socket server:", newSocket.id);
    });

    // Cleanup on unmount (disconnect socket)
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};