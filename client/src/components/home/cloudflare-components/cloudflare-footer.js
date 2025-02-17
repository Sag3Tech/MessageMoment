import { chatContext } from "@/chat-context";
import CustomTurnstile from "@/components/custom-turnstile";
import { ApiRequest } from "@/utils/api-request";
import React, { useState } from "react";
import { Spin } from "antd";

/**
 * CloudflareFooter component handles the rendering of the Turnstile widget and
 * the generate link/Open Chat button at the bottom of the Cloudflare modal.
 * It also renders a note about the Terms of Use and Privacy Policy.
 *
 * @param {func} setIsCfVerified - sets the state of whether the Turnstile verification has been completed
 * @param {string} url - the url of the chat session
 * @param {func} setUrl - sets the state of the url
 * @param {func} setSecureCode - sets the state of the secure code
 * @param {boolean} IsCfVerified - whether the Turnstile verification has been completed
 * @param {object} router - the router object
 * @returns {ReactElement} the rendered CloudflareFooter component
 */
const CloudflareFooter = ({
  setIsCfVerified,
  url,
  setUrl,
  setSecureCode,
  IsCfVerified,
  router,
}) => {
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
    <>
      <div className="gen-btn">
        <CustomTurnstile
          setIsCfVerified={setIsCfVerified}
          key={"cloudflare-custom-turnstile"}
        />
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
            <Spin size="small" />
          ) : url ? (
            "Open Chat"
          ) : (
            "Generate Link"
          )}
        </button>
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
    </>
  );
};

export default CloudflareFooter;
