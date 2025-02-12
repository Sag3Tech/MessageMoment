"use client";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { chatContext } from "@/chat-context";
import { useRouter } from "next/navigation";
import { isFirefox } from "react-device-detect";
import MobileQrScannerModal from "./cloudflare-components/Qr-scanner-mobile-modal";
import CloudflareBody from "./cloudflare-components/cloudflare-body";
import CloudflareFooter from "./cloudflare-components/cloudflare-footer";
import CloudflareHeader from "./cloudflare-components/cloudflare-header";
import MobileCloudFlare from "./cloudflare-components/mobile-cloudflare";
import MobileDropdownModal from "./cloudflare-components/mobile-dropdown-modal";
import NotificationTooltip from "./cloudflare-components/notification-tooltip";
import { handleCopyText } from "@/dummy-data";
import axios from "axios";

export const cloudFlareRef = createRef(null);
/**
 * Cloudflare component handles the generation and sharing of secure chat links.
 * It manages state for various UI elements including tooltips, modals, and notifications.
 * Utilizes `useEffect` to detect browser type and window size changes for responsive design.
 *
 * - Initializes chat session data and browser detection on mount.
 * - Handles visibility toggles for notifications and tooltips.
 * - Manages dropdown and modal interactions for selecting chat types.
 * - Generates random URLs and security codes for chat sessions.
 * - Integrates with `ClipboardJS` for copying links and leverages `Turnstile` for security verification.
 *
 * Note: To run Cloudflare locally, set `IsCfVerified` to true and bypass the Turnstile error handling.
 */

const Cloudflare = () => {
  const router = useRouter();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileModalRef = useRef(null);
  // contenxt
  const {
    setSessionData,
    sessionData,
    setIsWalletConnected,
    setdropdownSelected,
  } = chatContext();
  // stats
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [urlType, setUrlType] = useState("");
  const [secureCode, setSecureCode] = useState("");
  const [open, setOpen] = useState(false);
  const [IsCfVerified, setIsCfVerified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationtype, setNotificationType] = useState("reg");
  const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);
  const [isCopyVisibleTooltip, setCopyIsVisibleTooltip] = useState(false);
  const [isQrVisibleTooltip, setQrIsVisibleTooltip] = useState(false);
  const [QrVisible, setQrVisisble] = useState(false);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [openQrMobileModal, setOpenQrMobileModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Standard");

  const generateSessionLink = useCallback(async () => {
    try {
      console.log("Selected Session Type:", selectedOption.toLowerCase());
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/generate-session-link`,
        {
          sessionType: selectedOption.toLowerCase(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("API Response:", data);

      const chatUrl = `https://messagemoment.com/chat/${data.data.sessionId}`;

      setUrl(chatUrl);
      setSecureCode(data.data.secureSecurityCode || "");
      setSessionData((prev) => ({
        ...prev,
        code: data.data.sessionId,
        url: chatUrl,
        secureCode: data.data.secureSecurityCode || "",
      }));
    } catch (error) {
      console.error("Error generating session link:", error);
      alert("Failed to generate session link. Please try again.");
    }
  }, [selectedOption, setSessionData]);
  useEffect(() => {
    setIsWalletConnected(false);
    setSessionData((prev) => ({
      ...prev,
      type: "Standard",
    }));
  }, [isFirefox]);

  const toggleVisibility = (type) => {
    if (!isVisible) {
      setNotificationType(type);
      setIsVisible(!isVisible);
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }
  };

  const handleDropdownVisibleChange = (open) => {
    setOpen(open);
  };

  const handleSelectUrlTYpe = (value) => {
    setUrl("");
    setSecureCode("");
    setUrlType(value);
    setSessionData((prev) => ({
      ...prev,
      type: value,
    }));
    setSelectedOption(value);
  };

  const handleCopy = async () => {
    const isSuccess = await handleCopyText(url, secureCode, urlType);
    if (isSuccess) {
      setCopyIsVisibleTooltip(false);
      toggleVisibility("copy");
    }
  };

  const generateRandomString = (length) => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    setSessionData((prev) => ({
      ...prev,
      code: result,
      url: `https://messagemoment.com/chat/${result}`,
    }));
    return result;
  };

  function generateRandomNumber() {
    const result = Math.floor(1000 + Math.random() * 9000);
    setSessionData((prev) => ({
      ...prev,
      secureCode: result,
    }));
    return result;
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleRegenrateClick = () => {
    setIsVisibleTooltip(false);
    setUrl(`https://messagemoment.com/chat/${generateRandomString(12)}`);
    setSecureCode(generateRandomNumber());
    setNotificationType("reg");
    toggleVisibility("reg");
  };

  const handleHover = (type = "reg") => {
    if (!QrVisible) {
      if (type == "reg") {
        setIsVisibleTooltip(true);
      } else if (type == "copy") {
        setCopyIsVisibleTooltip(true);
      } else {
        setQrIsVisibleTooltip(true);
      }
    }
  };

  const handleMouseLeave = (type = "reg") => {
    if (!QrVisible) {
      if (type == "reg") {
        setIsVisibleTooltip(false);
      } else if (type == "copy") {
        setCopyIsVisibleTooltip(false);
      } else {
        setQrIsVisibleTooltip(false);
      }
    }
  };
  const onQrChange = (val) => {
    if (val) {
      setQrIsVisibleTooltip(false);
      setQrVisisble(true);
    } else {
      setQrVisisble(false);
    }
  };

  const selectOption = (option) => {
    setUrl("");
    setSecureCode("");
    setUrlType(option);
    setSessionData((prev) => ({
      ...prev,
      type: option,
    }));
    setSelectedOption(option);
    setOpen(false);
    setdropdownSelected(option);
    // close mobile modal if its true
    if (openMobileModal) setOpenMobileModal((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
    if (
      mobileModalRef.current &&
      !mobileModalRef.current.contains(event.target)
    ) {
      setOpen(false);
      if (isFirefox) {
      } else {
        setOpenMobileModal(false);
      }
      setOpenQrMobileModal(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <NotificationTooltip
        notificationtype={notificationtype}
        isVisible={isVisible}
      />
      <MobileDropdownModal
        ref={mobileModalRef}
        openMobileModal={openMobileModal}
        setOpenMobileModal={setOpenMobileModal}
        selectOption={selectOption}
        setOpen={setOpen}
      />
      <MobileQrScannerModal
        ref={mobileModalRef}
        openQrMobileModal={openQrMobileModal}
        setOpenQrMobileModal={setOpenQrMobileModal}
        url={url}
      />
      {/* CloudFlare Section start For Mobile & Desktop UI */}
      <section
        ref={cloudFlareRef}
        className={`cloud-flare ${
          selectedOption == "Secure" ? "secure" : "default"
        }`}
      >
        <CloudflareHeader />
        <MobileCloudFlare
          ref={buttonRef}
          openMobileModal={openMobileModal}
          setOpenMobileModal={setOpenMobileModal}
          selectOption={selectOption}
          open={open}
          setOpen={setOpen}
          selectedOption={selectedOption}
          setOpenQrMobileModal={setOpenQrMobileModal}
          {...{
            IsCfVerified,
            handleCopy,
            handleRegenrateClick,
            router,
            secureCode,
            sessionData,
            setSecureCode,
            setIsCfVerified,
            setSessionData,
            setUrl,
            url,
          }}
        />
        {/* *** Desktop cloudfalre body *** */}
        <div className="bottom">
          <CloudflareBody
            {...{
              IsCfVerified,
              handleCopy,
              handleDropdownVisibleChange,
              // handleRegenrateClick,
              handleHover,
              handleMouseLeave,
              handleSelectUrlTYpe,
              isCopyVisibleTooltip,
              isQrVisibleTooltip,
              isVisibleTooltip,
              loading,
              onQrChange,
              secureCode,
              selectOption,
              selectedOption,
              url,
              urlType,
              generateSessionLink  //new one
            }}
          />

          <CloudflareFooter
            {...{
              IsCfVerified,
              router,
              setIsCfVerified,
              setSecureCode,
              setUrl,
              url,
              generateSessionLink
            }}
          />
        </div>
      </section>
    </>
  );
};

export default Cloudflare;
