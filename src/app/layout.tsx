import type { Metadata } from "next";
import { Press_Start_2P, Nunito } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Birthday Adventure — Awll Level Up",
  description: "Happy Birthday, Awll!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${pressStart2P.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between bg-retro-bg select-none">
        {children}
      </body>
    </html>
  );
}
