"use client";

import { motion } from "framer-motion";
import Snowfall from "react-snowfall";

export default function Home() {
  const headerClasses =
    "bg-[url('/mail_bg.png')] bg-cover bg-center h-[125px] flex items-center justify-center rounded-t-[3rem] p-4";

  const headerTextClasses =
    "text-white text-5xl font-extrabold tracking-tight drop-shadow-xl md:text-6xl leading-none";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sticker bg-[#DA4A3C]">
      <Snowfall />
      <main className="text-center z-10 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white backdrop-blur-md rounded-[3rem] shadow-xl border-4 border-[#fff] overflow-hidden"
        >
          <div className={headerClasses}></div>

          <div className="p-8 md:p-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 drop-shadow-sm tracking-tight leading-none text-[#DA4A3C]">
              Secret
              <br />
              <span className="text-[#2DC45E]">Santa</span>
            </h1>

            <div className="w-24 h-2 bg-[#DA4A3C] mx-auto rounded-full mb-8 opacity-40"></div>

            <p className="text-xl md:text-2xl text-slate-700 font-body leading-relaxed mb-8">
              Witaj w świątecznym losowaniu! <br />
              Aby dołączyć do zabawy lub sprawdzić wynik,
              <span className="font-bold text-[#DA4A3C]">
                użyj linku z zaproszenia.
              </span>
            </p>

            <div className="flex flex-col gap-3 items-center justify-center pt-4 opacity-70">
              <p className="text-sm font-body text-slate-500 uppercase tracking-widest">
                Made with ❄️ for Friends
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
