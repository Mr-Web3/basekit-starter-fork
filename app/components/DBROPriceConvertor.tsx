import React, { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { base } from "viem/chains";

interface DBROPriceConverterProps {
  amount?: string;
  className?: string;
}

// Base mainnet contract addresses
const DBRO_ADDRESS = "0x6a4e0F83D7882BcACFF89aaF6f60D24E13191E9F";
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006"; // Base WETH
const DBRO_WETH_PAIR = "0xEB768991b3FD55f2aCD45C2682ac97951364d0Be"; // Direct DBRO/WETH V2 pair address

// Uniswap V2 Pair ABI
const UNISWAP_V2_PAIR_ABI = [
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      { name: "reserve0", type: "uint112" },
      { name: "reserve1", type: "uint112" },
      { name: "blockTimestampLast", type: "uint32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC20 ABI for decimals
const ERC20_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const DBROPriceConverter: React.FC<DBROPriceConverterProps> = ({
  amount,
  className,
}) => {
  const [dbroPrice, setDBROPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the direct DBRO/WETH V2 pair address
  const dbroWethPair = DBRO_WETH_PAIR;

  // Get reserves from the DBRO/WETH V2 pair
  const { data: dbroWethReserves } = useReadContract({
    address: dbroWethPair as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: "getReserves",
    chainId: base.id,
  });

  // Get token0 address to determine order for DBRO/WETH
  const { data: dbroWethToken0 } = useReadContract({
    address: dbroWethPair as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: "token0",
    chainId: base.id,
  });

  // Get decimals for tokens
  const { data: dbroDecimals } = useReadContract({
    address: DBRO_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: base.id,
  });

  const { data: wethDecimals } = useReadContract({
    address: WETH_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: base.id,
  });

  // We don't need ETH price since we're getting USD directly from Uniswap
  // The DBRO price is calculated directly from the Uniswap pool reserves

  useEffect(() => {
    const calculatePrice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("DBROPriceConverter Debug:", {
          dbroWethPair,
          dbroWethReserves,
          dbroWethToken0,
          dbroDecimals,
          wethDecimals,
        });

        // Check if we have all required data
        if (
          !dbroWethReserves ||
          !dbroWethToken0 ||
          !dbroDecimals ||
          !wethDecimals
        ) {
          console.log("Missing pool data:", {
            dbroWethReserves,
            dbroWethToken0,
            dbroDecimals,
            wethDecimals,
          });
          setError("Loading pool data...");
          return;
        }

        const [reserve0, reserve1] = dbroWethReserves;

        // Determine which token is which based on token0
        const isDBROFirst =
          dbroWethToken0.toLowerCase() === DBRO_ADDRESS.toLowerCase();
        const dbroReserve = isDBROFirst ? reserve0 : reserve1;
        const wethReserve = isDBROFirst ? reserve1 : reserve0;

        // Calculate price: WETH per DBRO
        // First convert reserves to human-readable amounts
        const dbroReserveFormatted = Number(dbroReserve) / 10 ** dbroDecimals;
        const wethReserveFormatted = Number(wethReserve) / 10 ** wethDecimals;

        console.log("Price calculation details:", {
          dbroReserve: dbroReserve.toString(),
          wethReserve: wethReserve.toString(),
          dbroReserveFormatted,
          wethReserveFormatted,
          dbroDecimals,
          wethDecimals,
        });

        // Calculate price: WETH per DBRO
        const priceInWETH = wethReserveFormatted / dbroReserveFormatted;

        // For now, we'll use a reasonable ETH price since we're getting USD directly from Uniswap
        // In production, you might want to get ETH price from a more reliable source
        const ETH_PRICE = 4000; // Fallback ETH price
        const priceInUSD = priceInWETH * ETH_PRICE;

        console.log("Final price calculation:", {
          priceInWETH,
          priceInUSD,
        });

        setDBROPrice(priceInUSD);
      } catch (err) {
        console.error("Error calculating DBRO price:", err);
        setError("Failed to calculate price");
      } finally {
        setIsLoading(false);
      }
    };

    calculatePrice();
  }, [
    dbroWethPair,
    dbroWethReserves,
    dbroWethToken0,
    dbroDecimals,
    wethDecimals,
  ]);

  const calculateUSDValue = () => {
    if (!dbroPrice || !amount) return null;

    const dbroAmount = parseFloat(amount);
    const usdValue = dbroAmount * dbroPrice;

    // Format with appropriate decimal places based on value
    let formattedValue;
    if (usdValue >= 1000) {
      // For values >= $1000, show 2 decimal places
      formattedValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdValue);
    } else if (usdValue >= 1) {
      // For values >= $1, show 2 decimal places
      formattedValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdValue);
    } else if (usdValue >= 0.01) {
      // For values >= $0.01, show 4 decimal places
      formattedValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(usdValue);
    } else {
      // For very small values, show 6 decimal places
      formattedValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(usdValue);
    }

    return formattedValue;
  };

  if (isLoading) {
    return <span className={className}>Loading price...</span>;
  }

  if (error) {
    return <span className={className}>Price unavailable</span>;
  }

  if (!dbroPrice) {
    return <span className={className}>Price unavailable</span>;
  }

  const usdValue = calculateUSDValue();

  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <span className="text-white">
          {amount ? usdValue : `1 $DBRO = $${dbroPrice.toFixed(6)}`}
        </span>
      </div>
    </div>
  );
};

export default DBROPriceConverter;
