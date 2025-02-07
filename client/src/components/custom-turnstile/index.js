import { Turnstile } from "@marsidev/react-turnstile";
import React from "react";

const CustomTurnstile = ({ setIsCfVerified}) => {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_KEY}
      // siteKey="0x4AAAAAAA72Ygruykfnb8YY"
      onSuccess={() => setIsCfVerified(true)}
      onError={(err) => {
        setIsCfVerified(false);
      }}
    />
  );
};

export default CustomTurnstile;
