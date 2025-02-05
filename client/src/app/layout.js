import ChatContextProvider from "@/chat-context";
import "../../public/styles/main.scss";

export const metadata = {
  title: "MessageMoment - The real meaning to personal!",
  description: "MessageMoment - The real meaning to personal!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="description" content={metadata.description} />
        <meta name="application-name" content="MessageMoment" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="MessageMoment" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
      </head>
        <body><ChatContextProvider>{children}</ChatContextProvider></body>
    </html>
  );
}
