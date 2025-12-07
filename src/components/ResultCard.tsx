"use client";

import { motion } from "framer-motion";

interface ResultCardProps {
  receiver?: string;
  giftIdeas?: string[];
  dontBuy?: string[];
}

const ResultCard: React.FC<ResultCardProps> = ({
  receiver,
  giftIdeas,
  dontBuy,
}) => {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-red-400">
        🎄 Your Secret Santa is: {receiver} 🎄
      </h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Dont Buy:</h3>
        <ul className="list-disc list-inside space-y-1">
          {dontBuy?.map((interest, index) => (
            <li key={index} className="text-gray-400">
              {interest}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-300">
          Gift Ideas:
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {giftIdeas?.map((idea, index) => (
            <li key={index} className="text-gray-400">
              {idea}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ResultCard;
