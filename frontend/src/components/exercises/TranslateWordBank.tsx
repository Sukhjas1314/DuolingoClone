import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface TranslateWordBankProps {
  prompt: string;
  bank: string[];
  onSelect: (answer: string) => void;
}

export function TranslateWordBank({ prompt, bank, onSelect }: TranslateWordBankProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(bank);

  const handleSelect = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
    onSelect([...selectedWords, word].join(" "));
  };

  const handleDeselect = (word: string, index: number) => {
    setAvailableWords([...availableWords, word]);
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    onSelect(newSelected.join(" "));
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-duo-textDark mb-4">{prompt}</h1>
      
      {/* Answer Line */}
      <div className="min-h-[60px] border-b-2 border-duo-grey flex flex-wrap gap-2 pb-2">
        {selectedWords.map((word, i) => (
          <Button 
            key={`sel-${i}`} 
            variant="default" 
            className="text-lg normal-case"
            onClick={() => handleDeselect(word, i)}
          >
            {word}
          </Button>
        ))}
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {availableWords.map((word, i) => (
          <Button 
            key={`avail-${i}`} 
            variant="default" 
            className="text-lg normal-case"
            onClick={() => handleSelect(word, i)}
          >
            {word}
          </Button>
        ))}
      </div>
    </div>
  );
}
