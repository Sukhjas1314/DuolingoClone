"use client";

import { useState } from "react";
import { Star, Check, Lock, Book, Coffee, Heart, Plane, Smile, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

import { useEffect, useRef } from "react";

interface SkillNodeProps {
  id: number;
  index: number;
  totalLevels: number;
  levelsCompleted: number;
  status: "locked" | "available" | "in_progress" | "completed";
  icon: string;
  crowns?: number;
}

export function SkillNode({ id, index, totalLevels, levelsCompleted, status, icon, crowns }: SkillNodeProps) {
  const [showPopover, setShowPopover] = useState(false);
  const router = useRouter();
  const nodeRef = useRef<HTMLDivElement>(null);

  const cycle = index % 8;
  let offset = 0;
  if (cycle === 1 || cycle === 3) offset = 40;
  else if (cycle === 2) offset = 70;
  else if (cycle === 5 || cycle === 7) offset = -40;
  else if (cycle === 6) offset = -70;

  const isActive = status === "available" || status === "in_progress";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  
  useEffect(() => {
    if (isActive && nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive]);

  const progress = (levelsCompleted / totalLevels) * 100;

  const IconComp = {
    star: Star,
    book: Book,
    coffee: Coffee,
    heart: Heart,
    plane: Plane,
    smile: Smile,
    clock: Clock
  }[icon] || Star;

  return (
    <div ref={nodeRef} className="relative flex flex-col items-center" style={{ left: `${offset}px`, marginTop: index === 0 ? "24px" : "12px" }}>
      {isActive && (
        <div className="absolute -top-12 z-20 animate-bounce cursor-pointer" onClick={() => setShowPopover(!showPopover)}>
          <div className="bg-white border-2 border-duo-grey rounded-xl px-4 py-2 font-bold text-duo-green tracking-wide shadow-sm relative">
            START
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-duo-grey rotate-45" />
          </div>
        </div>
      )}

      {showPopover && (
        <div className="absolute -top-24 z-30 flex flex-col items-center">
          <div className="bg-white border-2 border-duo-grey rounded-xl p-4 shadow-xl w-64 flex flex-col gap-3">
            {isLocked ? (
              <h4 className="font-bold text-duo-textDark">Complete all levels above to unlock this.</h4>
            ) : (
              <>
                <h4 className="font-bold text-duo-textDark">
                  {isCompleted ? "Practice" : `Lesson ${levelsCompleted + 1} of ${totalLevels}`}
                </h4>
                <Button variant="primary" className="w-full" onClick={() => router.push(`/lesson/${id}`)}>
                  {isCompleted ? "PRACTICE +5 XP" : "START +10 XP"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Node Button */}
      <div className="relative z-10" onClick={() => setShowPopover(!showPopover)}>
        {/* Progress ring placeholder for active nodes */}
        {isActive && (
          <svg className="absolute -top-[14px] -left-[14px] w-[98px] h-[98px] -rotate-90">
             <circle className="text-duo-grey" strokeWidth="8" stroke="currentColor" fill="transparent" r="41" cx="49" cy="49" />
             <circle className="text-duo-yellow transition-all duration-500 ease-in-out" strokeWidth="8" strokeDasharray="257.6" strokeDashoffset={257.6 - (257.6 * progress) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="41" cx="49" cy="49" />
          </svg>
        )}

        <button
          className={cn(
            "relative w-[70px] h-[70px] rounded-full flex items-center justify-center border-b-8 active:border-b-0 active:translate-y-2 transition-all",
            {
              "bg-duo-grey border-gray-300 text-duo-textLight": isLocked,
              "bg-duo-green border-duo-greenShadow text-white": isActive,
              "bg-duo-yellow border-yellow-600 text-white": isCompleted,
            }
          )}
        >
          {isLocked ? <Lock size={32} /> : isCompleted ? (
            <div className="flex flex-col items-center">
              <Check size={28} />
              {crowns && crowns > 0 && <span className="absolute -bottom-2 -right-2 bg-duo-yellow border-2 border-white rounded-full text-white text-xs px-2 font-bold">{crowns}</span>}
            </div>
          ) : <IconComp size={32} className="text-white fill-white" />}
        </button>
      </div>
    </div>
  );
}
