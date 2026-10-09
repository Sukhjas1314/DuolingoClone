"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api";
import { Heart, Snowflake, Zap, Gem } from "lucide-react";
import { ComingSoonModal } from "@/components/ui/ComingSoon";

export default function ShopPage() {
  const { user, fetchData } = useAppStore();
  const [errorToast, setErrorToast] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isSuperModalOpen, setIsSuperModalOpen] = useState(false);
  const [isGemsModalOpen, setIsGemsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchase = async (itemCode: string, price: number) => {
    if (!user) return;
    if (user.stats.gems < price) {
      setErrorToast("Not enough gems!");
      setTimeout(() => setErrorToast(""), 3000);
      return;
    }
    
    try {
      await api.post("/shop/purchase", { item_code: itemCode });
      setSuccessToast("Purchase successful!");
      setTimeout(() => setSuccessToast(""), 3000);
      fetchData(); // Refresh gems and hearts
    } catch (e: any) {
      setErrorToast(e.response?.data?.detail || "Purchase failed");
      setTimeout(() => setErrorToast(""), 3000);
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center font-bold text-duo-grey text-xl">Loading...</div>;

  return (
    <div className="flex h-screen bg-white dark:bg-[#131F24] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-[80px] lg:ml-[256px] lg:mr-[320px] h-full overflow-y-auto pb-24 lg:pb-0">
        <TopBar />
        
        <main className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-8 flex flex-col gap-12">
          
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-duo-textDark border-b-2 border-duo-grey pb-4">Hearts</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Heart size={48} fill="#FF4B4B" className="text-duo-red" />
                <div className="flex flex-col">
                  <span className="font-bold text-duo-textDark text-lg">Refill Hearts</span>
                  <span className="text-duo-textLight font-medium">Get full hearts to keep learning</span>
                </div>
              </div>
              <Button 
                variant={user.stats.hearts === 5 ? "ghost" : "primary"}
                className={user.stats.hearts === 5 ? "opacity-50 cursor-not-allowed" : ""}
                disabled={user.stats.hearts === 5}
                onClick={() => handlePurchase("heart_refill", 350)}
              >
                {user.stats.hearts === 5 ? "FULL" : <span className="flex items-center gap-2"><Gem size={16} /> 350</span>}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-duo-textDark border-b-2 border-duo-grey pb-4">Power-Ups</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Snowflake size={48} fill="#1CB0F6" className="text-duo-blue" />
                <div className="flex flex-col">
                  <span className="font-bold text-duo-textDark text-lg">Streak Freeze</span>
                  <span className="text-duo-textLight font-medium">Protect your streak if you miss a day</span>
                </div>
              </div>
              <Button variant="primary" onClick={() => handlePurchase("streak_freeze", 200)}>
                <span className="flex items-center gap-2"><Gem size={16} /> 200</span>
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <Zap size={48} fill="#FFC800" className="text-duo-yellow" />
                <div className="flex flex-col">
                  <span className="font-bold text-duo-textDark text-lg">Double XP</span>
                  <span className="text-duo-textLight font-medium">Double your XP for 15 minutes</span>
                </div>
              </div>
              <Button variant="primary" onClick={() => handlePurchase("double_xp", 100)}>
                <span className="flex items-center gap-2"><Gem size={16} /> 100</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-duo-textDark border-b-2 border-duo-grey pb-4">Super Duolingo</h1>
            
            <div className="border-2 border-duo-purple rounded-2xl p-6 bg-purple-50 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => setIsSuperModalOpen(true)}>
              <div className="flex items-center gap-4">
                <Mascot state="happy" className="w-16 h-16" />
                <div className="flex flex-col">
                  <span className="font-bold text-duo-purple text-xl">Super Duolingo</span>
                  <span className="text-duo-textDark font-medium">No ads, personalized practice, and unlimited hearts!</span>
                </div>
              </div>
              <Button variant="primary" className="bg-duo-purple border-b-purple-700 hover:bg-purple-400">
                TRY IT FREE
              </Button>
            </div>
          </div>

        </main>
      </div>

      {/* Right Column / Super Mock */}
      <div className="hidden xl:flex w-80 flex-col border-l-2 border-duo-grey p-6 gap-6">
        <div className="border-2 border-duo-purple rounded-2xl p-6 flex flex-col items-center gap-4 bg-purple-50">
          <Mascot state="idle" className="w-24 h-24" />
          <h2 className="font-bold text-xl text-center text-duo-purple">Super Duolingo</h2>
          <p className="text-center text-duo-textDark font-medium">Try 2 weeks free to get unlimited hearts and no ads.</p>
          <Button variant="primary" className="w-full bg-duo-purple border-b-purple-700 hover:bg-purple-400" onClick={() => setIsSuperModalOpen(true)}>TRY 2 WEEKS FREE</Button>
        </div>
      </div>
      
      {/* Toasts */}
      {errorToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-duo-red text-white px-6 py-3 rounded-xl font-bold z-50">
          {errorToast}
        </div>
      )}
      {successToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-duo-green text-white px-6 py-3 rounded-xl font-bold z-50">
          {successToast}
        </div>
      )}

      {/* Modals */}
      <ComingSoonModal isOpen={isSuperModalOpen} onClose={() => setIsSuperModalOpen(false)} featureName="Super Duolingo" />
      <ComingSoonModal isOpen={isGemsModalOpen} onClose={() => setIsGemsModalOpen(false)} featureName="Gem Purchases" />
    </div>
  );
}
