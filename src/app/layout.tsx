import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time is Money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://use.typekit.net/lwv5hcl.css"
          crossOrigin=""
        />
        <link rel="stylesheet" href="https://use.typekit.net/lwv5hcl.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
