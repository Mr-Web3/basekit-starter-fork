"use client";

import React, { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import Footer from "./Footer";
import Image from "next/image";

type ResponsiveShellProps = {
  children: React.ReactNode;
};

export default function ResponsiveShell({ children }: ResponsiveShellProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);

    const detectMiniApp = async () => {
      try {
        const inMini = await sdk.isInMiniApp();
        if (inMini) {
          setIsMiniApp(true);
        } else {
          const inFrame = window !== window.top;
          const userAgent = navigator.userAgent || "";
          const referrer = document.referrer || "";
          const href = window.location?.href || "";
          setIsMiniApp(
            inFrame || href.includes("frame") || referrer.includes("farcaster") || userAgent.includes("Farcaster")
          );
        }
      } catch {
        setIsMiniApp(false);
      }
    };

    updateIsMobile();
    detectMiniApp();

    const t = setTimeout(() => setInitialized(true), 80);
    window.addEventListener("resize", updateIsMobile);
    return () => {
      window.removeEventListener("resize", updateIsMobile);
      clearTimeout(t);
    };
  }, []);

  const showMobileLayout = isMobile || isMiniApp;

  if (!initialized) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
          <Image
            src="/newLogo.png"
            alt="DBRO"
            width={96}
            height={96}
            className="h-24 w-24 rounded-md shadow-md animate-pulse"
            priority
          />
          <div className="flex flex-col items-center space-y-2">
            <div className="text-(--app-accent) font-mono text-sm">
              <span className="animate-pulse">$</span> Initializing DBRO Mini
              Temp Protocol...
            </div>
            <div className="text-green-300 font-mono text-xs opacity-80">
              <span className="animate-pulse">{">"}</span> Connecting to Base
              Network...
            </div>
            <div className="text-green-500 font-mono text-xs opacity-60">
              <span className="animate-pulse">{">"}</span> Loading smart
              contracts...
            </div>
            <div className="text-green-400 font-mono text-xs opacity-70">
              <span className="animate-pulse">{">"}</span> Ready to stake the
              future! 🚀
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className={`flex-1 ${showMobileLayout ? "pb-16" : "pt-0"}`}>
        {children}
      </main>
      <Footer />
      {showMobileLayout && <MobileNavigation />}
    </div>
  );
}
