import chain from "@/assets/icons/chat/chain.svg";
import instagram from "@/assets/icons/chat/instagram.svg";
import mail from "@/assets/icons/chat/mail.svg";
import message from "@/assets/icons/chat/messageIcon.svg";
import messenger from "@/assets/icons/chat/messenger.svg";
import share from "@/assets/icons/chat/share.svg";
import small_arrow from "@/assets/icons/chat/small_arrow.svg";
import telegram from "@/assets/icons/chat/telegram.svg";
import whatsapp from "@/assets/icons/chat/whatsapp.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


const ShareButton = ({onCopyClick}) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  // Close modal when clicking outside

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderShareModal = () => {
    return (
      <div
        ref={modalRef}
        className={`share-modal ${showModal ? "share-modal-open" : ""}`}
      >
        <div className="head">
          <p>Share this Channel</p>
          <Image src={small_arrow} alt={"small_arrow"} />
        </div>
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
        </ul>
        <div className="footer-block">

          <p className="chat-text">https://messagemoment.com/chat/S2d3454</p>
        </div>
        <div className="chain-block" onClick={()=>onCopyClick("https://messagemoment.com/chat/S2d3454")}>
          <Image src={chain} alt="chain"/>
          <p className="chat-text">Copy URL</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <button
        ref={buttonRef}
        className="share-btn"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        <Image src={share} alt="share-btn" />
        <div>
          <p className="chat-text">Share</p>
        </div>
      </button>
      {renderShareModal()}
    </div>
  );
};

export default ShareButton;
