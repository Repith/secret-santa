"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Gift } from "lucide-react";
import confetti from "canvas-confetti";

interface StickerResultCardProps {
  receiverName: string;
  wants: string[];
  dontWants: string[];
  recieverAvatar?: string;
}

export const StickerResultCard = ({
  receiverName,
  wants,
  dontWants,
  recieverAvatar,
}: StickerResultCardProps) => {
  // Konfetti (pozostawiamy jako element świąteczny)
  useEffect(() => {
    // ... kod confetti bez zmian
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ffffff", "#DA4A3C"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ffffff", "#DA4A3C"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const listVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 + 0.8, duration: 0.3 },
    }),
  };

  // Logika skalowania czcionki imienia (dla Mateusz, Karolina)
  const getNameSize = (name: string) => {
    if (name.length > 10) return "text-5xl md:text-6xl";
    if (name.length > 7) return "text-6xl md:text-7xl";
    return "text-7xl md:text-8xl";
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className="relative w-full max-w-3xl mx-auto p-4" // Zwiększamy max-w
    >
      {/* Biała obwódka naklejki (Border) */}
      <div className="bg-white p-1 md:p-2 rounded-[3rem] shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 border-4 border-white/50">
        {/* Główny Kontener - teraz w jasnym tle */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden border-8 border-[#DA4A3C]">
          {" "}
          {/* Grubsza czerwona ramka */}
          {/* SEKCJA 1: NAGŁÓWEK + IMIĘ (Czerwone tło) */}
          <div className="bg-[#DA4A3C] pt-6 pb-2 px-6 md:pt-8 md:pb-4 md:px-10 relative overflow-hidden">
            {/* Tekst nagłówka */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-sticker text-white text-2xl md:text-3xl leading-tight opacity-80"
            >
              Prezent od Ciebie dostanie:
            </motion.p>

            {/* Imię z dynamicznym skalowaniem */}
            <motion.h1
              initial={{ scale: 0, rotate: 5 }}
              animate={{ scale: 1, rotate: -1 }}
              transition={{ type: "spring", delay: 0.5, stiffness: 200 }}
              className={`font-sticker ${getNameSize(
                receiverName,
              )} text-white drop-shadow-[2px_6px_0_rgba(0,0,0,0.2)] z-10 leading-none py-2`}
            >
              {receiverName}
            </motion.h1>

            {/* Dekoracyjny Gift w tle */}
            <Gift className="absolute text-red-700/20 w-40 h-40 -right-8 -bottom-8 rotate-12" />
          </div>
          {/* SEKCJA 2: LISTY (Białe tło - Lekkość i Puszystość) */}
          <div className="grid grid-cols-2 gap-0 bg-white border-t-4 border-[#DA4A3C]">
            {/* CHCE (LEWA) */}
            <div className="p-4 md:p-8 border-r-4 border-[#DA4A3C]">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#22C55E] rounded-full p-1 md:p-2 shadow-lg">
                  <Check className="text-white w-6 h-6 md:w-8 md:h-8 stroke-[4]" />
                </div>
                <h2 className="font-sticker text-3xl md:text-4xl text-[#DA4A3C] drop-shadow-md">
                  Chce
                </h2>
              </div>

              {/* Lista - Scroll tylko na mobile, desktop bez scrolla */}
              <ul
                className="space-y-2 text-slate-700 font-body 
                           max-h-[30vh] overflow-y-auto md:max-h-full md:overflow-y-visible pr-2"
              >
                {wants.length > 0 ? (
                  wants.map((item, i) => (
                    <motion.li
                      key={i}
                      custom={i}
                      variants={listVariant}
                      initial="hidden"
                      animate="visible"
                      className="text-lg flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-[#DA4A3C] rounded-full inline-block mt-2 flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))
                ) : (
                  <p className="text-slate-400 italic">
                    Cokolwiek dasz, będzie super!
                  </p>
                )}
              </ul>
            </div>

            <div className="p-4 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#EF4444] border-2 border-white rounded-full p-1 md:p-2 shadow-lg">
                  <X className="text-white w-6 h-6 md:w-8 md:h-8 stroke-[4]" />
                </div>
                <h2 className="font-sticker text-3xl md:text-4xl text-[#DA4A3C] drop-shadow-md">
                  Nie chce
                </h2>
              </div>

              <ul
                className="space-y-2 text-slate-700 font-body
                           max-h-[30vh] overflow-y-auto md:max-h-full md:overflow-y-visible pr-2"
              >
                {dontWants.length > 0 ? (
                  dontWants.map((item, i) => (
                    <motion.li
                      key={i}
                      custom={i}
                      variants={listVariant}
                      initial="hidden"
                      animate="visible"
                      className="text-lg flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-[#DA4A3C] rounded-full inline-block mt-2 flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))
                ) : (
                  <p className="text-slate-400 italic">Brak uwag!</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="absolute -bottom-16 -right-24 md:-right-54 w-64 h-64 md:w-108 md:h-108 filter drop-shadow-lg z-20"
      >
        <img
          src={recieverAvatar}
          alt="Santa Avatar"
          className="transform rotate-3 hover:rotate-1 transition-transform w-full h-full object-contain"
        />
      </motion.div>
    </motion.div>
  );
};
