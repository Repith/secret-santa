import { Toaster } from "sonner";
import Providers from "../components/Providers";
import SnowBackground from "../components/SnowBackground";
import "./globals.css";

import { Fredoka, Outfit } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-fredoka",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${outfit.variable} font-sans antialiased`}
      >
        <SnowBackground />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
