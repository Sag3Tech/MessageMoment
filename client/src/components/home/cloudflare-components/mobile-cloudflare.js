import Image from "next/image";
import React, { forwardRef, useState } from "react";
import globe from "@/assets/icons/globe.svg";
import lock from "@/assets/icons/secure.svg";
import wallet from "@/assets/icons/wallet.svg";
import dropdownIcon from "@/assets/icons/dropdown.svg";
import dropDownIcon from "@/assets/icons/dropdown_Icon.svg";
import reload from "@/assets/icons/reload.svg";
import qrcodeGray from "@/assets/icons/qrcode-grey.svg";
import qrcode from "@/assets/icons/qrcode.svg";
import copyGray from "@/assets/icons/copy-grey.svg";
import copy from "@/assets/icons/copy.svg";
import { chatContext } from "@/chat-context";
import CustomTurnstile from "@/components/custom-turnstile";
import { ApiRequest } from "@/utils/api-request";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const MobileCloudFlare = forwardRef(
  (
    {
      setOpenMobileModal,
      setOpen,
      selectedOption,
      url,
      open,
      IsCfVerified,
      setIsCfVerified,
      handleRegenrateClick,
      setOpenQrMobileModal,
      secureCode,
      handleCopy,
      setSecureCode,
      router,
      setUrl,
    },
    ref
  ) => {
    const { setSessionData, sessionData } = chatContext();
    const [loading, setLoading] = useState(false);

    const handleGenerateClick = async () => {
      try {
        setLoading(true);
        const response = await ApiRequest("/generate-session-link", "POST", {
          sessionType: sessionData.type.toLowerCase(),
        });

        if (response?.data?.sessionId) {
          const generatedUrl = `https://messagemoment.com/chat/${response.data.sessionId}`;

          setSessionData((prev) => ({
            ...prev,
            code: response.data.sessionId,
            url: generatedUrl,
            secureCode: response.data.secureSecurityCode || "",
          }));

          setUrl(generatedUrl);
          setSecureCode(response.data.secureSecurityCode || "");
        }
      } catch (error) {
        console.error("Error generating session link:", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="mobile-cloudflare">
        <div className="cloudflare-card">
          {/* cloudflare link */}
          <div className="cloudflare-header">
            <div
              className="dropdown-menu"
              onClick={() => {
                setOpenMobileModal(true);
                setOpen(true);
              }}
            >
              <Image
                src={
                  selectedOption == "Standard"
                    ? globe
                    : selectedOption == "Wallet"
                    ? wallet
                    : lock
                }
                alt="globe"
              />
              <p>{selectedOption}</p>
              <Image
                src={open ? dropDownIcon : dropdownIcon}
                alt="dropdown icon"
                className="small-icon"
              />
            </div>
            <div className="link-section">
              <p className="small">{url}</p>
            </div>
          </div>
          {selectedOption == "Secure" && (
            <div className="cloudflare-header flex-center">
              <Image src={lock} alt="globe" />
              <p className="small">{url && secureCode}</p>
            </div>
          )}
          {/* cloudflare body */}
          <div className="body">
            <CustomTurnstile
              setIsCfVerified={setIsCfVerified}
              key={"cloudflare-custom-turnstile"}
            />
          </div>
        </div>
        {/* cloudflare buttons */}
        <div className="cloudflare-btns">
          <div className="right">
            <div className="btns-wrapper">
              {/* Regenerate Tooltip */}
              <button
                disabled={url && IsCfVerified ? false : true}
                onClick={url && handleRegenrateClick}
                className={url ? "regen" : "regen-disable"}
              >
                <Image src={reload} alt="reload" />
              </button>
              {/* Qr Tooltip */}
              <button
                disabled={!url}
                onClick={() => setOpenQrMobileModal(true)}
                className={!url && "disable-tooltip"}
              >
                <Image src={url ? qrcode : qrcodeGray} alt="qrcode" />
              </button>

              {/* Copy tooltip */}
              <button
                ref={ref}
                disabled={!url}
                onClick={handleCopy}
                className={!url && "my-anchor-element disable-tooltip"}
              >
                <Image src={url ? copy : copyGray} alt="copy" />
              </button>
            </div>
          </div>
          <div className="gen-btn">
            <button
              disabled={!IsCfVerified || loading}
              onClick={() => {
                if (!url) {
                  handleGenerateClick();
                } else {
                  router.push(`/chat/${sessionData?.code}`);
                }
              }}
              className={`text-blue ${!IsCfVerified && "inactive"} ${
                loading ? "loading" : ""
              }`}
            >
              {loading ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : url ? (
                "Open Chat"
              ) : (
                "Generate Link"
              )}
            </button>
          </div>
        </div>
        <p className="note text-white text-center">
          By starting this chat session, you agree to our{" "}
          <span className="underline-link">
            <a href="/terms" target="_blank">
              Terms of Use
            </a>
          </span>{" "}
          and{" "}
          <span className="underline-link">
            <a href="/privacy" target="_blank">
              Privacy Policy
            </a>
          </span>
          , and that you and everybody you share the chat link with is above 16
          years of age.
        </p>
      </div>
    );
  }
);

export default MobileCloudFlare;
