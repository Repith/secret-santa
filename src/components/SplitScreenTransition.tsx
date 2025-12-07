"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SplitScreenTransitionProps {
  children: ReactNode;
  isOpen: boolean;
  duration?: number;
}

const SplitScreenTransition: React.FC<SplitScreenTransitionProps> = ({
  children,
  isOpen,
  duration = 0.5,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-500 to-red-600"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "-100%" : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500 to-green-600"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "100%" : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default SplitScreenTransition;
