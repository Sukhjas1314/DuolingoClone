import { useState } from "react";

interface FillInBlankProps {
  prompt: string;
  payload: { sentence: string, blankIndex: number, options: string[] };
  onSelect: (answer: string) => void;
}

export function FillInBlank({ prompt, payload, onSelect }: FillInBlankProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (opt: string) => {
    setSelected(opt);
    onSelect(opt);
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-duo-textDark mb-4">{prompt}</h1>
      
      <div className="text-xl font-bold text-duo-textDark p-4 border-2 border-duo-grey rounded-xl">
        {payload.sentence.split('_')[0]}
        <span className="inline-block border-b-2 border-duo-textDark w-20 text-center text-duo-blue mx-2">
          {selected || " "}
        </span>
        {payload.sentence.split('_')[1]}
      </div>

      <div className="flex gap-4 justify-center">
        {payload.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleClick(opt)}
            className="border-2 border-b-4 border-duo-grey rounded-xl p-4 font-bold text-duo-textDark hover:bg-gray-50 active:border-b-2 active:translate-y-[2px]"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
