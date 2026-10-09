"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAppStore } from "@/store/useAppStore";
import { RightBar } from "@/components/layout/RightBar";
import { Clock, Lock } from "lucide-react";
import { ComingSoonModal } from "@/components/ui/ComingSoon";
import { useState } from "react";
import Link from "next/link";

export default function QuestsPage() {
  const { user } = useAppStore();

  const [modalFeature, setModalFeature] = useState<string | null>(null);

  return (
    <>
      <Sidebar />
      <div className="flex flex-col md:ml-[80px] lg:ml-[256px] lg:mr-[300px] bg-white dark:bg-[#131F24] min-h-screen transition-colors duration-300">
        <TopBar />
        <div className="flex flex-col items-center pb-24 lg:pb-0 px-4">
          <div className="w-full lg:max-w-2xl mt-8 flex flex-col gap-8">
          
            {/* Purple Banner */}
            <div className="w-full bg-[#8C52FF] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
              <div className="flex flex-col gap-2 relative z-10 w-2/3">
                <h1 className="text-2xl font-bold text-white">Welcome!</h1>
                <p className="text-white text-sm font-medium">Complete quests to earn rewards! Quests refresh every day.</p>
              </div>
              <div className="text-6xl relative z-10">🦉</div>
              {/* Optional background deco */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-white opacity-10 rounded-full" />
            </div>

            {/* Daily Quests Header */}
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-bold text-duo-textDark dark:text-white">Daily Quests</h2>
              <div className="flex items-center gap-2 text-duo-orange font-bold uppercase text-sm">
                <Clock size={18} />
                <span>7 Hours</span>
              </div>
            </div>

            {/* Quest Cards */}
            <div className="flex flex-col w-full gap-4">
              
              <div className="flex items-center gap-x-6 p-5 border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl">
                <div className="text-4xl text-yellow-400">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div className="flex flex-col w-full gap-y-3">
                  <h3 className="font-bold text-lg text-duo-textDark dark:text-white">Earn 10 XP</h3>
                  <div className="flex items-center gap-x-3 w-full">
                    <div className="w-full h-4 bg-gray-200 dark:bg-duo-darkCard rounded-full relative overflow-hidden flex-1">
                      <div className="absolute top-0 left-0 h-full bg-yellow-400 w-1/4 rounded-full"></div>
                    </div>
                    <span className="font-bold text-duo-textLight text-sm shrink-0">0 / 10</span>
                    <span className="text-xl shrink-0">🎁</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-x-6 p-5 border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl opacity-60">
                <div className="text-3xl text-duo-textLight bg-gray-200 dark:bg-duo-darkCard w-12 h-12 rounded-xl flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="font-bold text-lg text-duo-textLight">More quests unlock soon</h3>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <RightBar>
        {/* Monthly Challenges Box */}
        <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-duo-textDark dark:text-white w-2/3 leading-tight">Monthly challenges unlock soon!</h3>
            <div className="text-4xl bg-yellow-400 rounded-full w-14 h-14 flex items-center justify-center border-4 border-white dark:border-[#131F24] shadow-sm relative -top-2">⚡</div>
          </div>
          <p className="text-duo-textLight font-medium text-sm leading-relaxed pr-4">
            Complete each month's challenge to earn exclusive badges
          </p>
          <Link href="/learn" className="w-full">
            <button 
              className="w-full py-3 rounded-xl border-2 border-duo-grey dark:border-duo-darkBorder font-bold text-duo-blue hover:bg-gray-50 dark:hover:bg-duo-darkCard transition uppercase text-sm"
            >
              Start a lesson
            </button>
          </Link>
        </div>
      </RightBar>

      <ComingSoonModal isOpen={modalFeature !== null} onClose={() => setModalFeature(null)} featureName={modalFeature || ""} />

      <MobileTabBar />
    </>
  );
}
