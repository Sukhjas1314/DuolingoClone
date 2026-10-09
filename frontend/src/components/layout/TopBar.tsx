import { Flame, Gem, Heart } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

export function TopBar() {
  const { user } = useAppStore();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleLangSelect = (lang: string) => {
    setToastMsg(`${lang} coming soon!`);
    setShowLangDropdown(false);
    setTimeout(() => setToastMsg(""), 3000);
  };

  if (!user) return <div className="h-[58px] border-b-2 border-duo-grey bg-white dark:bg-[#131F24] flex items-center justify-between px-4 md:hidden sticky top-0 z-40 transition-colors duration-300" />;

  const { stats } = user;

  return (
    <div className="h-[58px] border-b-2 border-duo-grey bg-white dark:bg-[#131F24] flex lg:hidden items-center justify-between px-4 sticky top-0 z-50 transition-colors duration-300 w-full">


      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-duo-textDark text-white px-6 py-3 rounded-xl font-bold z-50 shadow-xl">
          {toastMsg}
        </div>
      )}
      
      <div className="flex items-center gap-x-4 lg:gap-x-8 font-bold">
        <Link href="/stats/streak" className="flex items-center gap-x-2 text-duo-orange hover:opacity-80 transition">
          <Flame size={24} className="fill-duo-orange" />
          <span>{stats.current_streak}</span>
        </Link>
        
        <Link href="/store" className="flex items-center gap-x-2 text-duo-blue hover:opacity-80 transition">
          <Gem size={24} className="fill-duo-blue" />
          <span>{stats.gems}</span>
        </Link>
        
        <Link href="/store" className="flex items-center gap-x-2 text-duo-red hover:opacity-80 transition">
          <Heart size={24} className="fill-duo-red" />
          <span>{stats.hearts}</span>
        </Link>
      </div>

      <div 
        className="flex items-center gap-x-2 relative py-4"
        onMouseEnter={() => setShowLangDropdown(true)}
        onMouseLeave={() => setShowLangDropdown(false)}
      >
        <button 
          className="w-10 h-8 bg-yellow-400 rounded-lg border-2 border-duo-grey dark:border-duo-darkBorder flex items-center justify-center text-sm hover:opacity-80 transition"
          onClick={() => setShowLangDropdown(!showLangDropdown)}
        >
          🇪🇸
        </button>

        {showLangDropdown && (
          <div className="absolute top-14 right-0 bg-white dark:bg-[#131F24] border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl shadow-xl w-56 flex flex-col overflow-hidden z-50">
            <button className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-duo-darkCard font-bold text-duo-textDark dark:text-white">
              <span className="text-2xl">🇪🇸</span> Spanish (Active)
            </button>
            <button className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-duo-darkCard font-bold text-duo-textLight dark:text-gray-400" onClick={() => handleLangSelect("French")}>
              <span className="text-2xl opacity-50">🇫🇷</span> French
            </button>
            <button className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-duo-darkCard font-bold text-duo-textLight dark:text-gray-400" onClick={() => handleLangSelect("German")}>
              <span className="text-2xl opacity-50">🇩🇪</span> German
            </button>
            <button className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-duo-darkCard font-bold text-duo-textLight dark:text-gray-400" onClick={() => handleLangSelect("Japanese")}>
              <span className="text-2xl opacity-50">🇯🇵</span> Japanese
            </button>
            <button className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-duo-darkCard font-bold text-duo-textLight dark:text-gray-400" onClick={() => handleLangSelect("Italian")}>
              <span className="text-2xl opacity-50">🇮🇹</span> Italian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
