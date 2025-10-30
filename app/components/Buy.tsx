import { Buy } from "@coinbase/onchainkit/buy";
import type { Token } from "@coinbase/onchainkit/token";

export default function BuyComponents() {
  const dbroToken: Token = {
    name: "Decentral Bros",
    address: "0x6a4e0F83D7882BcACFF89aaF6f60D24E13191E9F",
    symbol: "$DBRO",
    decimals: 8,
    image: "./newLogoTwo.png",
    chainId: 8453,
  };

  return (
    <div
      className="flex items-center justify-center w-full"
      style={
        {
          "--ock-bg-default": "#111111",
          // '--ock-border-line-default': 'none',
          "--ock-bg-default-hover": "#1f2937",
          "--ock-bg-default-active": "#374151",
          "--ock-bg-alternate": "transparent",
          "--ock-bg-alternate-hover": "#1f2937",
          "--ock-bg-alternate-active": "#374151",
          "--ock-text-foreground": "#ffffff",
          "--ock-text-foreground-muted": "#b0b0b0",
          "--ock-text-inverse": "#111111",
          "--ock-border-radius": "0.5rem",
          "--ock-border-radius-inner": "0.375rem",
          "--ock-line-default": "#374151",
          "--ock-line-heavy": "#6b7280",
          "--ock-icon-color-foreground": "#1bf696",
          "--ock-icon-color-foreground-muted": "#b0b0b0",
          "--ock-icon-color-inverse": "#111111",
        } as React.CSSProperties
      }
    >
      <Buy toToken={dbroToken} isSponsored />
    </div>
  );
}
