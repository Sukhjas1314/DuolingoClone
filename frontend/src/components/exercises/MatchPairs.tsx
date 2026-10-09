import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface MatchPairsProps {
  prompt: string;
  pairs: Record<string, string>;
  onSelect: (answer: string) => void;
}

export function MatchPairs({ prompt, pairs, onSelect }: MatchPairsProps) {
  // Extract and shuffle keys (left column) and values (right column)
  const leftItems = useMemo(() => Object.keys(pairs).sort(() => Math.random() - 0.5), [pairs]);
  const rightItems = useMemo(() => Object.values(pairs).sort(() => Math.random() - 0.5), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [solved, setSolved] = useState<string[]>([]);
  
  // Track incorrect pairs temporarily to show red flash/shake
  const [errorPair, setErrorPair] = useState<{left: string, right: string} | null>(null);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (pairs[selectedLeft] === selectedRight) {
        // Match!
        setSolved((prev) => [...prev, selectedLeft, selectedRight]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Mismatch!
        setErrorPair({ left: selectedLeft, right: selectedRight });
        // In a fully integrated app, we would emit a 'mistake' event here to deduct a heart.
        setTimeout(() => {
          setErrorPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800); // Wait for shake animation to finish
      }
    }
  }, [selectedLeft, selectedRight, pairs]);

  useEffect(() => {
    // If all matched (number of solved items = total pairs * 2)
    if (solved.length > 0 && solved.length === Object.keys(pairs).length * 2) {
      onSelect("all");
    } else {
      onSelect(""); // Clear selection if not completely solved
    }
  }, [solved, pairs, onSelect]);

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto gap-8 pt-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-duo-textDark mb-4 px-4">{prompt}</h1>
      
      <div className="flex justify-between gap-4 px-4 h-full min-h-[300px]">
        {/* Left Column */}
        <div className="flex flex-col gap-3 flex-1">
          {leftItems.map((item) => {
            const isSolved = solved.includes(item);
            const isSelected = selectedLeft === item;
            const isError = errorPair?.left === item;

            if (isSolved) {
              return (
                <div key={item} className="h-14 w-full rounded-xl bg-gray-100 border-2 border-gray-200 transition-all duration-300 opacity-0 pointer-events-none" />
              );
            }

            return (
              <motion.button
                key={item}
                onClick={() => !isSelected && !errorPair && setSelectedLeft(item)}
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`h-14 w-full rounded-xl border-2 border-b-4 font-bold text-lg transition-all active:border-b-2 active:translate-y-[2px] ${
                  isError ? "bg-red-50 border-duo-red text-duo-red"
                  : isSelected ? "bg-blue-50 border-duo-blue text-duo-blue"
                  : "bg-white border-duo-grey text-duo-textDark hover:bg-gray-50"
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 flex-1">
          {rightItems.map((item) => {
            const isSolved = solved.includes(item);
            const isSelected = selectedRight === item;
            const isError = errorPair?.right === item;

            if (isSolved) {
              return (
                <div key={item} className="h-14 w-full rounded-xl bg-gray-100 border-2 border-gray-200 transition-all duration-300 opacity-0 pointer-events-none" />
              );
            }

            return (
              <motion.button
                key={item}
                onClick={() => !isSelected && !errorPair && setSelectedRight(item)}
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`h-14 w-full rounded-xl border-2 border-b-4 font-bold text-lg transition-all active:border-b-2 active:translate-y-[2px] ${
                  isError ? "bg-red-50 border-duo-red text-duo-red"
                  : isSelected ? "bg-blue-50 border-duo-blue text-duo-blue"
                  : "bg-white border-duo-grey text-duo-textDark hover:bg-gray-50"
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
