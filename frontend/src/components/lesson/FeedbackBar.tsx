import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface FeedbackBarProps {
  status: "idle" | "correct" | "incorrect" | "completed";
  onCheck: () => void;
  disabled?: boolean;
  correctAnswer?: string;
}

export function FeedbackBar({ status, onCheck, disabled, correctAnswer }: FeedbackBarProps) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 border-t-2 h-[140px] px-4 flex items-center justify-center transition-colors lg:px-0",
      status === "correct" && "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
      status === "incorrect" && "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800",
      status === "idle" && "bg-white dark:bg-[#131F24] border-duo-grey dark:border-duo-darkBorder",
      status === "completed" && "bg-white dark:bg-[#131F24] border-duo-grey dark:border-duo-darkBorder"
    )}>
      <div className="max-w-[1140px] w-full mx-auto flex items-center justify-between">
        {status === "idle" && (
          <div className="hidden lg:block text-transparent">Placeholder</div>
        )}
        
        {status === "correct" && (
          <div className="text-duo-greenShadow dark:text-duo-green text-2xl font-bold flex items-center gap-x-4">
            <div className="bg-white rounded-full p-2 text-duo-green"><Check size={30} strokeWidth={4} /></div>
            Great job!
          </div>
        )}
        
        {status === "incorrect" && (
          <div className="text-duo-redShadow dark:text-duo-red text-xl font-bold flex flex-col gap-y-1">
            <div className="flex items-center gap-x-4 text-2xl">
              <div className="bg-white rounded-full p-2 text-duo-red"><X size={30} strokeWidth={4} /></div>
              Correct solution:
            </div>
            <p className="text-duo-red dark:text-red-400 font-medium mt-1">{correctAnswer}</p>
          </div>
        )}
        
        <Button 
          disabled={disabled}
          variant={status === "incorrect" ? "danger" : status === "correct" ? "primary" : "primary"}
          size="lg"
          onClick={onCheck}
          className="w-full lg:w-auto lg:min-w-[150px]"
        >
          {status === "idle" ? "Check" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
