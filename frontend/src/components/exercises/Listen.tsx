import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Volume2 } from "lucide-react";

interface ListenProps {
  prompt: string;
  textToSpeak: string;
  onSelect: (answer: string) => void;
}

export function Listen({ prompt, textToSpeak, onSelect }: ListenProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePlay = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES'; // Spanish
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlaySlow = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES';
      utterance.rate = 0.5;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8 items-center">
      <h1 className="text-2xl lg:text-3xl font-bold text-duo-textDark dark:text-white mb-4 w-full text-left">{prompt}</h1>
      
      <div className="flex gap-4 mb-4">
        <Button 
          variant="primary" 
          className="w-24 h-24 rounded-2xl flex items-center justify-center bg-duo-blue border-b-blue-600 hover:bg-blue-400"
          onClick={handlePlay}
        >
          <Volume2 size={48} fill="white" className="text-white" />
        </Button>
        <Button 
          variant="primary" 
          className="w-16 h-16 rounded-2xl flex items-center justify-center self-end bg-duo-blue border-b-blue-600 hover:bg-blue-400"
          onClick={handlePlaySlow}
        >
          <Volume2 size={24} fill="white" className="text-white" />
          <span className="text-white font-bold ml-1 text-xs">🐢</span>
        </Button>
      </div>

      <textarea 
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSelect(e.target.value);
        }}
        placeholder="Type what you hear"
        className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-duo-grey dark:border-gray-700 rounded-2xl p-4 text-xl font-medium focus:outline-none focus:border-duo-blue resize-none h-32"
        autoFocus
      />
    </div>
  );
}
