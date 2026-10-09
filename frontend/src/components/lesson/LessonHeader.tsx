import { Heart, X } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface LessonHeaderProps {
  hearts: number;
  percentage: number;
  onQuit: () => void;
}

export function LessonHeader({ hearts, percentage, onQuit }: LessonHeaderProps) {
  return (
    <header className="pt-[20px] pb-[50px] flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full px-4 lg:px-10 bg-white dark:bg-[#131F24] transition-colors duration-300">
      <X 
        onClick={onQuit} 
        className="text-duo-textLight hover:opacity-75 transition cursor-pointer"
        size={28}
      />
      <ProgressBar value={percentage} />
      <div className="text-duo-red flex items-center font-bold gap-x-2">
        <Heart size={28} className="fill-duo-red" />
        {hearts === -1 ? "∞" : hearts}
      </div>
    </header>
  );
}
