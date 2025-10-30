"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT,
        appearance: {
          mode: "auto",
          theme: "custom",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
        wallet: {
          display: "modal",
          preference: "all",
          termsUrl: "https://www.decentralbros.io/terms",
          privacyUrl: "https://www.decentralbros.io/privacy",
          supportedWallets: { 
            rabby: false, 
            trust: true, 
            frame: false, 
          }, 
        },
      }}
      miniKit={{
        enabled: true,
        autoConnect: true,
        notificationProxyUrl: undefined,
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
