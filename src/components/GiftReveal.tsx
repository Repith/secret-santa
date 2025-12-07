"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";

interface GiftRevealProps {
  onRevealComplete: () => void;
}

export const GiftReveal = ({ onRevealComplete }: GiftRevealProps) => {
  const [isOpened, setIsOpened] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpened(true);
      setTimeout(onRevealComplete, 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onRevealComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="mb-8 relative inline-block"
            >
              <div className="bg-[#DA4A3C] p-8 rounded-3xl shadow-2xl border-4 border-white">
                <Gift className="w-32 h-32 text-white" strokeWidth={1.5} />
              </div>
              {/* Wstążka */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-white/20" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-white/20" />
            </motion.div>

            <motion.h2
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-sticker text-2xl text-white mt-4"
            >
              Losowanie kogoś specjalnego...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
