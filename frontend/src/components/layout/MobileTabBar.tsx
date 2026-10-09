import Link from "next/link";
import { Home, List, Shield, User } from "lucide-react";

export function MobileTabBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-white dark:bg-[#131F24] border-t-2 border-duo-grey flex items-center justify-around px-4 z-50 transition-colors duration-300">
      <Link href="/learn" className="p-3 text-duo-grey hover:text-duo-green transition-colors">
        <Home size={32} />
      </Link>
      <Link href="/leaderboard" className="p-3 text-duo-grey hover:text-duo-blue transition-colors">
        <Shield size={32} />
      </Link>
      <Link href="/quests" className="p-3 text-duo-grey hover:text-duo-orange transition-colors">
        <List size={32} />
      </Link>
      <Link href="/profile" className="p-3 text-duo-grey hover:text-duo-textDark transition-colors">
        <User size={32} />
      </Link>
    </div>
  )
}
