"use client";
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();
const ChatContextProvider = ({ children }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filedata, setFiledata] = useState({});
  const [showAttachment, setShowAttachment] = useState(false);

  // project mode on
  const [isProjectModeOn, setIsProjectModeOn] = useState(false);
  // Leave chat modal
  const [showChatLeaveModal, setShowChatLeaveModal] = useState(false);
  // report file modal
  const [showReportfileModal, setShowReportfileModal] = useState(false);
  // home page
  const [sessionData, setSessionData] = useState({
    type: "Standard",
    code: "",
    url: "",
    secureCode: "",
  });

  // expiry chat time
  const [expiryTime, setExpiryTime] = useState("");

  // verify security code
  const [isVerifiedCode, setIsVerifiedCode] = useState(false);

  // projectMode mobile tooltip
  const [showProjectModeTooltip, setShowProjectModeTooltip] = useState(false);

  // share tooltip
  const [showShareTooltip, setShareTooltip] = useState(false);

  // show notification on copy link from share tooltip
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  // Call connect wallet function
  const [connectWalletFunction, setConnectWalletFunction] = useState(
    () => () => {}
  );

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Wallet Exist or not
  const [isWalletExist, setIsWalletExist] = useState(true);

  // dropdown selected
  const [dropdownSelected, setdropdownSelected] = useState("Standard");

  const data = {
    showUploadModal,
    setShowUploadModal,
    filedata,
    setFiledata,
    showAttachment,
    setShowAttachment,
    isProjectModeOn,
    setIsProjectModeOn,
    showChatLeaveModal,
    setShowChatLeaveModal,
    sessionData,
    setSessionData,
    setShowReportfileModal,
    showReportfileModal,
    expiryTime,
    setExpiryTime,
    setIsVerifiedCode,
    isVerifiedCode,
    showProjectModeTooltip,
    setShowProjectModeTooltip,
    showShareTooltip,
    setShareTooltip,
    showCopiedNotification,
    setShowCopiedNotification,
    connectWalletFunction,
    setConnectWalletFunction,
    isWalletConnected,
    setIsWalletConnected,
    isWalletExist,
    setIsWalletExist,
    setdropdownSelected,
    dropdownSelected,
  };

  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>;
};

// Custom hook for easier access to the context
export const chatContext = () => useContext(ChatContext);
export default ChatContextProvider;
