import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface MultipleChoiceProps {
  prompt: string;
  options: { text: string; image?: string }[];
  onSelect: (answer: string) => void;
}

export function MultipleChoice({ prompt, options, onSelect }: MultipleChoiceProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleClick = (idx: number, text: string) => {
    setSelectedIdx(idx);
    onSelect(text);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-4 lg:gap-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-duo-textDark dark:text-white mb-4">{prompt}</h1>
      
      <div className={cn(
        "grid gap-4",
        options[0].image ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {options.map((opt, idx) => (
          <div 
            key={idx}
            onClick={() => handleClick(idx, opt.text)}
            className={cn(
              "border-2 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-duo-darkCard transition-all border-b-4 active:border-b-2 active:translate-y-[2px]",
              selectedIdx === idx ? "bg-blue-50 dark:bg-blue-900/20 border-duo-blue text-duo-blue" : "border-duo-grey dark:border-duo-darkBorder bg-white dark:bg-transparent text-duo-textDark dark:text-white"
            )}
          >
            {opt.image && (
              <div className="aspect-square mb-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{opt.text}</span>
              <span className="text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 rounded px-2 text-sm">{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
