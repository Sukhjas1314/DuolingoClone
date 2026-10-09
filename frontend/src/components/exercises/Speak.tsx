import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Mic } from "lucide-react";

interface SpeakProps {
  prompt: string;
  textToSpeak: string;
  onSkip: () => void;
}

export function Speak({ prompt, textToSpeak, onSkip }: SpeakProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto gap-8 pt-4">
      <div className="w-full text-left font-bold text-2xl lg:text-3xl text-duo-textDark">
        {prompt}
      </div>

      <div className="flex items-center gap-6 w-full">
        <Mascot state="idle" className="w-24 h-24 hidden md:block" />
        <div className="border-2 border-duo-grey rounded-2xl p-4 lg:p-6 flex-1 text-xl lg:text-2xl font-medium text-duo-textDark">
          {textToSpeak}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-12 gap-6 w-full">
        <button 
          disabled
          className="w-32 h-32 rounded-full border-4 border-duo-grey bg-gray-100 flex items-center justify-center cursor-not-allowed opacity-50"
        >
          <Mic size={48} className="text-duo-textLight" />
        </button>
        <span className="font-bold text-duo-textLight text-center">Speaking exercises coming soon</span>
      </div>

      <div className="mt-12">
        <Button variant="ghost" onClick={onSkip}>CAN'T SPEAK NOW</Button>
      </div>
    </div>
  );
}
