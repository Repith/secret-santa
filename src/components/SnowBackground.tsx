"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  x: number;
  duration: number;
  delay: number;
}

const SnowBackground: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const generateSnowflakes = (w: number) =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 10,
    }));

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setWidth(newWidth);
      setHeight(newHeight);
      setSnowflakes(generateSnowflakes(newWidth));
    };

    handleResize(); // Set initial values
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute text-white text-2xl select-none"
          initial={{
            x: flake.x,
            y: -20,
            opacity: 0,
          }}
          animate={{
            y: height + 20,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
};

export default SnowBackground;
