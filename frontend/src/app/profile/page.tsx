"use client";

import { useAppStore } from "@/store/useAppStore";
import { TopBar } from "@/components/layout/TopBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ComingSoonModal } from "@/components/ui/ComingSoon";
import { Button } from "@/components/ui/Button";
import { RightBar } from "@/components/layout/RightBar";
import { Edit2, Search, Mail, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAppStore();
  const [modalFeature, setModalFeature] = useState<string | null>(null);

  if (!user) return null;

  return (
    <>
      <TopBar />
      <Sidebar />
      <div className="flex flex-col md:ml-[80px] lg:ml-[256px] lg:mr-[300px] min-h-screen pb-24 lg:pb-0 px-4 md:px-8 pt-8 items-center bg-white dark:bg-[#131F24] transition-colors duration-300">
        
        <div className="w-full max-w-2xl flex flex-col border-b-2 border-duo-grey dark:border-duo-darkBorder pb-6">
          {/* Avatar Header Box */}
          <div className="w-full h-48 bg-[#1A262C] rounded-2xl relative flex items-center justify-center mb-6 mt-4">
            <button 
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition"
              onClick={() => setModalFeature("Edit Profile")}
            >
              <Edit2 size={20} />
            </button>
            <div className="relative cursor-pointer hover:opacity-80 transition" onClick={() => setModalFeature("Edit Profile")}>
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-duo-blue flex items-center justify-center bg-duo-blue/20">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl text-duo-blue">+</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-duo-textDark dark:text-white">{user.display_name}</h1>
            <p className="text-duo-textLight font-medium">@{user.username}</p>
            <p className="text-duo-textLight font-medium mt-1">Joined October 2026</p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-6 font-bold text-duo-blue">
              <span className="hover:opacity-80 cursor-pointer">0 Following</span>
              <span className="hover:opacity-80 cursor-pointer">0 Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇪🇸</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-2xl font-bold text-duo-textDark dark:text-white mb-6">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-4 flex gap-4 items-center">
              <span className="text-3xl grayscale opacity-60">🔥</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-duo-textDark dark:text-white">{user.stats.current_streak}</span>
                <span className="text-sm font-bold text-duo-textLight">Day streak</span>
              </div>
            </div>
            <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-4 flex gap-4 items-center">
              <span className="text-3xl">⚡️</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-duo-textDark dark:text-white">{user.stats.total_xp}</span>
                <span className="text-sm font-bold text-duo-textLight">Total XP</span>
              </div>
            </div>
            <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-4 flex gap-4 items-center">
              <span className="text-3xl grayscale opacity-60">🛡️</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-duo-textDark dark:text-white">{user.stats.league}</span>
                <span className="text-sm font-bold text-duo-textLight">Current league</span>
              </div>
            </div>
            <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-4 flex gap-4 items-center">
              <span className="text-3xl grayscale opacity-60">🥇</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-duo-textDark dark:text-white">0</span>
                <span className="text-sm font-bold text-duo-textLight">Top 3 finishes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-duo-textDark dark:text-white">Achievements</h2>
            <span className="text-duo-blue font-bold text-sm cursor-pointer hover:opacity-80 uppercase">View all</span>
          </div>
          <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-6 flex flex-col gap-6">
            <div className={`flex gap-4 items-center ${user.achievements?.includes("wildfire") ? "opacity-100" : "opacity-50 grayscale"}`}>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl">🔥</div>
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex justify-between w-full">
                  <span className="font-bold text-duo-textDark dark:text-white">Wildfire</span>
                  <span className="font-bold text-duo-textLight">{user.achievements?.includes("wildfire") ? "Unlocked" : "Locked"}</span>
                </div>
                <div className="w-full h-3 bg-duo-grey dark:bg-duo-darkCard rounded-full overflow-hidden">
                  <div className={`h-full bg-duo-yellow rounded-full ${user.achievements?.includes("wildfire") ? "w-full" : `w-[${Math.min(100, Math.round((user.stats.current_streak / 14) * 100))}%]`}`} />
                </div>
                <span className="text-sm font-bold text-duo-textLight">Reach a 14 day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <RightBar>
        {/* Following / Followers Tabs */}
        <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center w-full border-b-2 border-duo-grey dark:border-duo-darkBorder">
            <button className="flex-1 pb-3 text-sm font-bold text-duo-blue border-b-2 border-duo-blue -mb-[2px]" onClick={() => setModalFeature("Following")}>FOLLOWING</button>
            <button className="flex-1 pb-3 text-sm font-bold text-duo-textLight hover:bg-gray-100 dark:hover:bg-duo-darkCard rounded-t-xl transition" onClick={() => setModalFeature("Followers")}>FOLLOWERS</button>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
            <div className="text-6xl">🧑‍🤝‍🧑</div>
            <p className="text-duo-textLight font-medium text-sm leading-relaxed">
              Learning is more fun and effective when you connect with others.
            </p>
          </div>
        </div>

        {/* Add friends box */}
        <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-5 flex flex-col gap-2">
          <h3 className="font-bold text-xl text-duo-textDark dark:text-white mb-2">Add friends</h3>
          
          <div 
            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-duo-darkCard rounded-xl cursor-pointer transition"
            onClick={() => setModalFeature("Find Friends")}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-duo-darkCard rounded-full flex items-center justify-center text-xl shrink-0"><Search size={20} className="text-duo-textLight" /></div>
              <span className="font-bold text-duo-textDark dark:text-white">Find friends</span>
            </div>
            <ChevronRight className="text-duo-textLight" />
          </div>

          <div 
            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-duo-darkCard rounded-xl cursor-pointer transition"
            onClick={() => setModalFeature("Invite Friends")}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-duo-darkCard rounded-full flex items-center justify-center text-xl shrink-0"><Mail size={20} className="text-duo-textLight" /></div>
              <span className="font-bold text-duo-textDark dark:text-white">Invite friends</span>
            </div>
            <ChevronRight className="text-duo-textLight" />
          </div>
        </div>
      </RightBar>
      
      <ComingSoonModal isOpen={modalFeature !== null} onClose={() => setModalFeature(null)} featureName={modalFeature || ""} />
      
      <MobileTabBar />
    </>
  );
}
