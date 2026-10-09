"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { RightBar } from "@/components/layout/RightBar";
import Link from "next/link";

export default function LeaderboardPage() {
  const { user } = useAppStore();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    api.get("/leaderboard").then((res) => {
      setLeaderboard(res.data);
    });
  }, []);

  return (
    <>
      <TopBar />
      <Sidebar />
      <div className="flex flex-col md:ml-[80px] lg:ml-[256px] lg:mr-[320px] min-h-screen pb-24 lg:pb-0 px-4 md:px-8 pt-8 items-center bg-white dark:bg-[#131F24] transition-colors duration-300">
        
        <div className="w-full max-w-2xl border-b-2 border-duo-grey pb-6 mb-6 flex items-center justify-center gap-4">
          <div className="w-16 h-16 bg-duo-grey rounded-full" />
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-duo-textDark">Silver League</h1>
            <p className="text-duo-textLight font-bold">Top 10 advance to the next league</p>
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col">
          {leaderboard.map((u, i) => {
            const isMe = user?.id === u.user_id;
            const isPromotion = i < 10;
            const isDemotion = i >= leaderboard.length - 5;
            
            return (
              <div key={u.user_id} className="relative">
                {i === 10 && (
                  <div className="w-full flex items-center gap-4 my-2">
                    <div className="h-[2px] bg-duo-green flex-1" />
                    <span className="text-duo-green font-bold text-sm uppercase">Promotion Zone</span>
                    <div className="h-[2px] bg-duo-green flex-1" />
                  </div>
                )}
                
                {i === leaderboard.length - 5 && (
                  <div className="w-full flex items-center gap-4 my-2">
                    <div className="h-[2px] bg-duo-red flex-1" />
                    <span className="text-duo-red font-bold text-sm uppercase">Demotion Zone</span>
                    <div className="h-[2px] bg-duo-red flex-1" />
                  </div>
                )}

                <div className={`flex items-center gap-4 p-4 rounded-xl ${isMe ? "bg-blue-50/50" : "hover:bg-gray-100"}`}>
                  <div className="w-8 text-center font-bold text-duo-green">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </div>
                  <img src={u.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-duo-grey" />
                  <div className="flex-1 font-bold text-duo-textDark">{u.display_name}</div>
                  <div className="font-bold text-duo-textLight">{u.weekly_xp} XP</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <RightBar>
        {/* What Are Leaderboards Box */}
        <div className="border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
          <h3 className="font-bold text-xs text-duo-textLight uppercase tracking-wider">What are leaderboards?</h3>
          
          <div className="flex flex-col gap-4 relative z-10 w-[70%]">
            <h4 className="font-bold text-lg text-duo-textDark dark:text-white leading-tight">Do lessons. Earn XP. Compete.</h4>
            <p className="text-duo-textLight font-medium text-sm leading-relaxed">
              Earn XP through lessons, then compete with players in a weekly leaderboard
            </p>
          </div>

          {/* Owl Graphic */}
          <div className="absolute right-[-10px] top-[40%] text-6xl">🏋️‍♂️</div>
        </div>
      </RightBar>

      <MobileTabBar />
    </>
  );
}
