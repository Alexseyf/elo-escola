import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elo Escola",
  description: "Plataforma Elo Escola",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.variable} ${firaCode.variable} antialiased`}
      >
        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
