import Link from "next/link";
import { Home, List, Shield, User, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/Button";

export function Sidebar() {
  return (
    <div className="hidden md:flex h-full w-[80px] lg:w-[256px] flex-col border-r-2 border-duo-grey px-2 lg:px-4 py-4 fixed left-0 top-0 bg-white dark:bg-[#131F24] transition-colors duration-300">
      <Link href="/learn" className="pt-8 lg:pl-4 pb-10 flex justify-center lg:justify-start">
        <h1 className="hidden lg:block text-3xl font-extrabold text-duo-green tracking-tighter">duolingo</h1>
        <div className="lg:hidden w-10 h-10 bg-duo-green rounded-xl" /> {/* Mascot icon placeholder for tablet */}
      </Link>
      
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem href="/learn" icon={<Home size={28} />} label="Learn" />
        <SidebarItem href="/leaderboard" icon={<Shield size={28} />} label="Leaderboards" />
        <SidebarItem href="/quests" icon={<List size={28} />} label="Quests" />
        <SidebarItem href="/profile" icon={<User size={28} />} label="Profile" />
        <SidebarItem href="/settings" icon={<MoreHorizontal size={28} />} label="More" />
      </div>
    </div>
  )
}

function SidebarItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-center lg:justify-start h-[52px] text-duo-textDark dark:text-duo-textLight uppercase">
        <span className="lg:mr-5">{icon}</span>
        <span className="hidden lg:block">{label}</span>
      </Button>
    </Link>
  )
}
