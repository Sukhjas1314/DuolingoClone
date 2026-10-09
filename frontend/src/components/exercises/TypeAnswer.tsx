import { useState } from "react";

interface TypeAnswerProps {
  prompt: string;
  onSelect: (answer: string) => void;
}

export function TypeAnswer({ prompt, onSelect }: TypeAnswerProps) {
  const [val, setVal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVal(e.target.value);
    onSelect(e.target.value);
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-duo-textDark mb-4">{prompt}</h1>
      
      <textarea 
        className="w-full border-2 border-duo-grey rounded-xl p-4 bg-gray-50 text-xl font-bold focus:outline-none focus:border-duo-blue focus:bg-white resize-none h-32"
        placeholder="Type in English"
        value={val}
        onChange={handleChange}
      />
    </div>
  );
}
