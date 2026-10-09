"use client";

import { motion } from "framer-motion";

interface MascotProps {
  state?: "idle" | "happy" | "sad";
  className?: string;
}

export function Mascot({ state = "idle", className }: MascotProps) {
  // A simple original SVG owl shape
  // state determines eye/beak/wing positions or animations

  const bounce = {
    y: ["0%", "-10%", "0%"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const happy = {
    y: ["0%", "-20%", "0%"],
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
    }
  };

  const sad = {
    y: ["0%", "5%", "0%"],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const currentAnim = state === "happy" ? happy : state === "sad" ? sad : bounce;

  return (
    <motion.div 
      className={`w-32 h-32 relative ${className || ""}`}
      animate={currentAnim as any}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Body */}
        <path d="M20 50 C20 10, 80 10, 80 50 C80 90, 20 90, 20 50 Z" fill="#58CC02" />
        
        {/* Belly */}
        <path d="M30 55 C30 35, 70 35, 70 55 C70 80, 30 80, 30 55 Z" fill="#89E219" />
        
        {/* Eyes */}
        {state === "sad" ? (
          <>
            {/* Sad eyes - semi closed */}
            <circle cx="40" cy="40" r="8" fill="white" />
            <circle cx="60" cy="40" r="8" fill="white" />
            <path d="M32 38 Q40 32 48 38" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 38 Q60 32 68 38" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <circle cx="42" cy="42" r="3" fill="#333" />
            <circle cx="58" cy="42" r="3" fill="#333" />
          </>
        ) : state === "happy" ? (
          <>
            {/* Happy eyes - closed tight */}
            <path d="M32 40 Q40 32 48 40" stroke="#333" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M52 40 Q60 32 68 40" stroke="#333" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Idle eyes - open */}
            <circle cx="40" cy="40" r="8" fill="white" />
            <circle cx="60" cy="40" r="8" fill="white" />
            <circle cx="42" cy="40" r="3" fill="#333" />
            <circle cx="58" cy="40" r="3" fill="#333" />
          </>
        )}

        {/* Beak */}
        <path d="M47 48 L53 48 L50 54 Z" fill="#FFC800" />

        {/* Wings */}
        <path d="M15 45 C5 50, 5 70, 25 65 Z" fill="#58CC02" />
        <path d="M85 45 C95 50, 95 70, 75 65 Z" fill="#58CC02" />
        
        {/* Feet */}
        <path d="M40 85 C35 95, 45 95, 45 85 Z" fill="#FF9600" />
        <path d="M60 85 C55 95, 65 95, 65 85 Z" fill="#FF9600" />
      </svg>
    </motion.div>
  );
}
