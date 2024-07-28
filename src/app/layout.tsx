import type { Metadata } from "next";
import ToastProvider from "@/providers/react-tostify/ToastProvider";
import "./globals.css";
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      
        <body className="min-h-screen min-w-screen">
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      
    </html>
  );
}
