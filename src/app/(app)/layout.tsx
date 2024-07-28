//create layout just for app

import React from "react";
import { Metadata } from "next";
import ToastProvider from "@/providers/react-tostify/ToastProvider";
import SideBar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Generated by create next app",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <div className="min-h-screen min-w-screen flex flex-col md:flex-row  gap-6">
        <SideBar/>
        <ToastProvider>
          <div className="py-6 px-4 md:px-10">
            {children}
          </div>
        </ToastProvider>
      </div>

  );
}