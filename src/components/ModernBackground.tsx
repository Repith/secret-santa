"use client";

import { motion } from "framer-motion";
import { Trees, Star, Snowflake, LucideIcon } from "lucide-react";

export const ModernBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#Fdfbf7] overflow-hidden">
      {/* Abstract Gradients - Soft & Modern */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      {/* Floating Sticker Elements (Subtle) */}
      <StickerDecor Icon={Trees} x="10%" y="20%" rotate={-10} color="#15803d" />
      <StickerDecor Icon={Star} x="85%" y="15%" rotate={15} color="#eab308" />
      <StickerDecor
        Icon={Snowflake}
        x="15%"
        y="80%"
        rotate={-5}
        color="#94a3b8"
      />
      <StickerDecor Icon={Trees} x="80%" y="75%" rotate={5} color="#15803d" />
    </div>
  );
};

const StickerDecor = ({
  Icon,
  x,
  y,
  rotate,
  color,
}: {
  Icon: LucideIcon;
  x: string;
  y: string;
  rotate: number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 0.15, scale: 1 }}
    className="absolute hidden md:block"
    style={{ left: x, top: y, color: color }}
  >
    <Icon
      size={64}
      strokeWidth={2.5}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  </motion.div>
);
