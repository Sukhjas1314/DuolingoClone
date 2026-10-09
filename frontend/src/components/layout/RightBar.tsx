import { Flame, Gem, Heart } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

export function RightBar({ children }: { children?: React.ReactNode }) {
  const { user } = useAppStore();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  if (!user) return null;
  const { stats } = user;

  const handleLangSelect = (lang: string) => {
    setToastMsg(`${lang} coming soon!`);
    setShowLangDropdown(false);
    setTimeout(() => setToastMsg(""), 3000);
  };

  return (
    <div className="hidden lg:flex flex-col fixed top-0 right-0 w-[320px] h-screen p-6 gap-6 pt-6 bg-transparent z-40">
      
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-duo-textDark text-white px-6 py-3 rounded-xl font-bold z-50 shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center justify-between w-full font-bold text-duo-textLight mb-4">
        <div 
          className="flex items-center relative py-2"
          onMouseEnter={() => setShowLangDropdown(true)}
          onMouseLeave={() => setShowLangDropdown(false)}
        >
          <button 
            className="w-10 h-8 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
          >
            {/* Standard circular/rectangular flag using emojis or images. Just use emoji for now with large text */}
            <span className="text-3xl">🇪🇸</span>
          </button>

          {showLangDropdown && (
            <div className="absolute top-12 left-0 bg-white dark:bg-[#131F24] border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl shadow-xl w-56 flex flex-col overflow-hidden z-50">
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

        <Link href="/stats/streak" className="flex items-center gap-x-2 text-duo-textLight hover:opacity-80 transition">
          <Flame size={28} className="fill-duo-orange text-duo-orange" />
          <span>{stats.current_streak}</span>
        </Link>
        
        <Link href="/store" className="flex items-center gap-x-2 text-duo-textLight hover:opacity-80 transition">
          <Gem size={28} className="fill-duo-blue text-duo-blue" />
          <span>{stats.gems}</span>
        </Link>
      </div>

      {children || (
        <>
          {/* Unlock Leaderboards */}
          <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-xl text-duo-textDark dark:text-white">Unlock Leaderboards!</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-duo-darkCard rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">🛡️</span>
              </div>
              <p className="text-duo-textLight font-medium text-sm">Complete 2 more lessons to start competing</p>
            </div>
          </div>

          {/* Daily Quests */}
          <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-duo-textDark dark:text-white">Daily Quests</h3>
              <span className="text-duo-blue font-bold text-sm cursor-pointer hover:opacity-80 uppercase">View all</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center shrink-0 text-yellow-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="font-bold text-duo-textDark dark:text-white">Earn 10 XP</span>
                <div className="w-full h-4 bg-gray-200 dark:bg-duo-darkCard rounded-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-yellow-400 w-1/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 px-2 text-xs font-bold text-duo-textLight uppercase opacity-50">
        <a href="#" className="hover:opacity-100">About</a>
        <a href="#" className="hover:opacity-100">Blog</a>
        <a href="#" className="hover:opacity-100">Store</a>
        <a href="#" className="hover:opacity-100">Efficacy</a>
        <a href="#" className="hover:opacity-100">Careers</a>
        <a href="#" className="hover:opacity-100">Investors</a>
        <a href="#" className="hover:opacity-100">Terms</a>
        <a href="#" className="hover:opacity-100">Privacy</a>
      </div>
    </div>
  );
}
