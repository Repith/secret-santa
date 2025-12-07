"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";

interface CircleDrawButtonProps {
  onClick?: () => void;
  text?: string;
  sticker?: string;
}

const CircleDrawButton: React.FC<CircleDrawButtonProps> = ({
  onClick,
  text = "Wylosuj!",
}) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 w-48 h-48 rounded-full border-4 border-red-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative w-48 h-48 rounded-full bg-white border-4 border-transparent flex items-center justify-center shadow-lg">
          <span className="text-6xl text-[#DA4A3C]">
            <Gift size={64} />
          </span>
        </div>
      </div>
      <p className="mt-6 text-2xl font-semibold text-white">{text}</p>
    </div>
  );
};

export default CircleDrawButton;
