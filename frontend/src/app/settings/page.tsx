"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api";
import { ComingSoonModal } from "@/components/ui/ComingSoon";

export default function SettingsPage() {
  const { user, fetchData } = useAppStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(50);
  const [modalFeature, setModalFeature] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setDailyGoal(user.stats.daily_xp_goal);
    }
  }, [user]);

  useEffect(() => {
    // Initial load
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleGoalChange = async (goal: number) => {
    setDailyGoal(goal);
    await api.post("/settings/goal", { goal });
    fetchData();
  };

  const handleSimulateDay = async () => {
    await api.post("/dev/simulate-day", { days: 1 });
    fetchData();
    alert("Simulated 1 day ahead!");
  };

  const handleReset = async () => {
    await api.post("/dev/reset", {});
    fetchData();
    alert("Database reset to initial seed!");
  };

  return (
    <>
      <TopBar />
      <Sidebar />
      <div className="flex flex-col md:ml-[80px] lg:ml-[256px] lg:mr-[300px] min-h-screen pb-24 lg:pb-0 px-4 md:px-8 pt-8 items-center bg-white dark:bg-[#131F24] transition-colors duration-300">
        
        <div className="w-full max-w-2xl flex flex-col gap-8">
          <h1 className="text-3xl font-bold text-duo-textDark dark:text-white">Settings</h1>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-duo-textLight">Preferences</h2>
            
            <div className="flex items-center justify-between p-4 border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl">
              <span className="font-bold text-duo-textDark dark:text-white">Sound Effects</span>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-14 h-8 rounded-full p-1 transition-colors ${soundEnabled ? "bg-duo-green" : "bg-duo-grey dark:bg-duo-darkBorder"}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl">
              <span className="font-bold text-duo-textDark dark:text-white">Dark Mode</span>
              <button 
                onClick={toggleDarkMode}
                className={`w-14 h-8 rounded-full p-1 transition-colors ${darkMode ? "bg-duo-green" : "bg-duo-grey dark:bg-duo-darkBorder"}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${darkMode ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-duo-textLight">Account</h2>
            
            <div className="flex flex-col border-2 border-duo-grey dark:border-duo-darkBorder rounded-2xl overflow-hidden cursor-pointer">
              <div className="flex items-center justify-between p-4 border-b-2 border-duo-grey dark:border-duo-darkBorder hover:bg-gray-50 dark:hover:bg-duo-darkCard transition-colors" onClick={() => setModalFeature("Notifications")}>
                <span className="font-bold text-duo-textDark dark:text-white">Notifications</span>
                <span className="text-duo-textLight">❯</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b-2 border-duo-grey dark:border-duo-darkBorder hover:bg-gray-50 dark:hover:bg-duo-darkCard transition-colors" onClick={() => setModalFeature("Privacy")}>
                <span className="font-bold text-duo-textDark dark:text-white">Privacy</span>
                <span className="text-duo-textLight">❯</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b-2 border-duo-grey dark:border-duo-darkBorder hover:bg-gray-50 dark:hover:bg-duo-darkCard transition-colors" onClick={() => setModalFeature("Help Center")}>
                <span className="font-bold text-duo-textDark dark:text-white">Help Center</span>
                <span className="text-duo-textLight">❯</span>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-duo-darkCard transition-colors" onClick={() => setModalFeature("Super Duolingo")}>
                <span className="font-bold text-duo-textDark dark:text-white">Super Duolingo</span>
                <span className="text-duo-textLight">❯</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-duo-textLight">Daily Goal</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[10, 20, 30, 50].map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalChange(goal)}
                  className={`p-4 rounded-xl border-2 font-bold text-center transition-all ${
                    dailyGoal === goal 
                      ? "border-duo-blue bg-blue-50 dark:bg-blue-900/20 text-duo-blue" 
                      : "border-duo-grey dark:border-duo-darkBorder text-duo-textLight hover:bg-gray-50 dark:hover:bg-duo-darkCard"
                  }`}
                >
                  {goal} XP
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <h2 className="text-xl font-bold text-duo-textLight">Developer Tools</h2>
            <div className="flex flex-col md:flex-row gap-4 p-4 border-2 border-dashed border-duo-red dark:border-red-800 rounded-2xl bg-red-50 dark:bg-red-900/10">
              <Button variant="ghost" onClick={handleSimulateDay} className="flex-1 bg-white dark:bg-transparent border-2 border-duo-grey dark:border-duo-darkBorder dark:text-white">
                Simulate +1 Day
              </Button>
              <Button variant="danger" onClick={handleReset} className="flex-1">
                Reset Database
              </Button>
            </div>
          </div>

        </div>
      </div>
      <ComingSoonModal isOpen={modalFeature !== null} onClose={() => setModalFeature(null)} featureName={modalFeature || ""} />
      <MobileTabBar />
    </>
  );
}
