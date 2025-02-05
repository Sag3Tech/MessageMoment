import chain from "@/assets/icons/chat/chain.svg";
import crossIcon from "@/assets/icons/chat/chat_mobile_icon/cross.svg";
import instagram from "@/assets/icons/chat/instagram.svg";
import mail from "@/assets/icons/chat/mail.svg";
import message from "@/assets/icons/chat/messageIcon.svg";
import messenger from "@/assets/icons/chat/messenger.svg";
import telegram from "@/assets/icons/chat/telegram.svg";
import whatsapp from "@/assets/icons/chat/whatsapp.svg";
import { chatContext } from "@/chat-context";
import ClipboardJS from "clipboard";
import Image from "next/image";
import { useEffect, useRef } from "react";

const ShareModeTooltip = ({ isAttachment }) => {
  const { showShareTooltip, setShareTooltip, setShowCopiedNotification } =
    chatContext();

  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShareTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShareTooltip]);

  const handleCopy = (text) => {
    setShareTooltip(false);
    const textToCopy = text;
    if (textToCopy) {
      const tempButton = document.createElement("button");
      tempButton.setAttribute("data-clipboard-text", textToCopy);
      const clipboard = new ClipboardJS(tempButton);
      clipboard.on("success", () => {
        setShowCopiedNotification(true);
        setTimeout(() => {
          setShowCopiedNotification(false);
        }, 2000);
      });

      clipboard.on("error", () => {
        console.error("Failed to copy text.");
      });
      tempButton.click();
      clipboard.destroy();
      tempButton.remove();
    }
  };

  return (
    <div
      ref={tooltipRef}
      className={`projectModetooltip
    ${showShareTooltip && "projectModetooltip-open"}
    ${isAttachment && "projectModetooltip-attachment"}
    `}
    >
      <div className="header-projectmode">
        <p className="chat-text">Share this Channel</p>
        <Image
          src={crossIcon}
          id="projectMode-cross"
          onClick={() => setShareTooltip(false)}
          alt="crossIcon"
        />
      </div>
      <div className="share-listtooltip">
        <ul>
          <li>
            <Image src={message} alt="message" />
            <p className="chat-text">Message</p>
          </li>
          <li>
            <Image src={mail} alt="mail" />
            <p className="chat-text">Mail</p>
          </li>
          <li>
            <Image src={messenger} alt="messenger" />
            <p className="chat-text">Messenger</p>
          </li>
          <li>
            <Image src={whatsapp} alt="whatsapp" />
            <p className="chat-text">WhatsApp</p>
          </li>
          <li>
            <Image src={telegram} alt="telegram" />
            <p className="chat-text">Telegram</p>
          </li>
          <li>
            <Image src={instagram} alt="instagram" />
            <p className="chat-text">Instagram</p>
          </li>
          <li
            onClick={() => handleCopy("https://messagemoment.com/chat/S2d3454")}
          >
            <Image src={chain} alt="chain" />
            <p className="chat-text">Copy URL</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShareModeTooltip;
