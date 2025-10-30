"use client";

import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaCoins,
  FaGift,
  FaLock,
  FaArrowUp,
  FaBoxOpen,
} from "react-icons/fa";

interface ToastProps {
  message: string;
  type: "success" | "error" | "loading";
  transactionType?: "approve" | "stake" | "unstake" | "claim" | "unwrap";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  transactionType = "stake",
  onClose,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast after a brief delay
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-400" />;
      case "error":
        return <FaTimesCircle className="text-red-400" />;
      case "loading":
        return <FaSpinner className="text-blue-400 animate-spin" />;
      default:
        return <FaCheckCircle className="text-green-400" />;
    }
  };

  const getTransactionIcon = () => {
    switch (transactionType) {
      case "approve":
        return <FaLock className="text-blue-400" />;
      case "stake":
        return <FaCoins className="text-green-400" />;
      case "unstake":
        return <FaArrowUp className="text-orange-400" />;
      case "claim":
        return <FaGift className="text-purple-400" />;
      case "unwrap":
        return <FaBoxOpen className="text-yellow-400" />;
      default:
        return <FaCoins className="text-green-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (transactionType) {
      case "approve":
        return "border-l-blue-500 bg-blue-900/20";
      case "stake":
        return "border-l-blue-500 bg-blue-900/20";
      case "unstake":
        return "border-l-blue-500 bg-blue-900/20";
      case "claim":
        return "border-l-blue-500 bg-blue-900/20";
      case "unwrap":
        return "border-l-blue-500 bg-blue-900/20";
      default:
        return "border-l-blue-500 bg-blue-900/20";
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl border border-gray-700 ${getBackgroundColor()} backdrop-blur-md shadow-2xl min-w-[300px] max-w-[400px]`}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          {getTransactionIcon()}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <FaTimesCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
