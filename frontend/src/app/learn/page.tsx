"use client";

import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightBar } from "@/components/layout/RightBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { UnitBanner } from "@/components/path/UnitBanner";
import { SkillNode } from "@/components/path/SkillNode";
import { Unit, Skill } from "@/types";

export default function LearnPage() {
  const { fetchData, loading, path } = useAppStore();
  const [activeUnitId, setActiveUnitId] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!path || !path.units || path.units.length === 0) return;
    
    if (!activeUnitId) {
      setActiveUnitId(path.units[0].id);
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const unitId = Number(entry.target.getAttribute("data-unit-id"));
            setActiveUnitId(unitId);
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px", // Trigger when unit enters top part of screen
        threshold: 0,
      }
    );

    const elements = document.querySelectorAll(".unit-section");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [path]);

  if (loading) {
    return (
      <>
        <div className="flex flex-col lg:ml-[256px] lg:mr-[300px]">
          <TopBar />
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="w-full h-24 bg-gray-200 animate-pulse rounded-xl" />
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full mt-8" />
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full mt-4 mr-16" />
          </div>
        </div>
        <MobileTabBar />
      </>
    );
  }

  if (!path || !path.units) {
    return (
      <>
        <div className="flex flex-col lg:ml-[256px] lg:mr-[300px]">
          <TopBar />
          <div className="p-6 text-center text-duo-textLight">No path data available.</div>
        </div>
        <MobileTabBar />
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col md:ml-[80px] lg:ml-[256px] lg:mr-[300px]">
        <TopBar />
        
        {/* Global Sticky Header */}
        {activeUnitId && path.units && (
          <div className="sticky top-0 z-40 bg-white dark:bg-[#131F24] pt-4 pb-2 px-4 lg:px-0 lg:max-w-[600px] lg:mx-auto w-full transition-colors duration-300">
            {path.units
              .filter((u: Unit) => u.id === activeUnitId)
              .map((u: Unit) => (
                <UnitBanner 
                  key={`banner-${u.id}`}
                  title={u.title} 
                  description={u.description} 
                  color={u.color || "duo-green"} 
                />
              ))}
          </div>
        )}

        <div className="flex flex-col pb-24 lg:pb-0 pt-4">
          {path.units.map((unit: Unit, unitIndex: number) => (
            <div 
              key={unit.id} 
              data-unit-id={unit.id}
              className="unit-section mb-10 w-full px-4 lg:px-0 lg:max-w-[600px] lg:mx-auto relative"
            >
              {unitIndex > 0 && (
                <div className="flex items-center justify-center w-full mt-4 mb-2">
                  <div className="h-[2px] flex-1 bg-duo-grey dark:bg-duo-darkBorder"></div>
                  <span className="px-4 text-duo-textLight font-bold text-lg">{unit.description}</span>
                  <div className="h-[2px] flex-1 bg-duo-grey dark:bg-duo-darkBorder"></div>
                </div>
              )}

              <div className="flex flex-col items-center mt-8 gap-6 relative pb-8">
                {unit.skills.map((skill: Skill, skillIndex: number) => {
                  return (
                    <SkillNode
                      key={skill.id}
                      id={skill.id}
                      index={skillIndex}
                      totalLevels={skill.total_levels}
                      levelsCompleted={skill.levels_completed || 0}
                      status={skill.status}
                      crowns={skill.crowns || 0}
                      icon={skill.icon}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <RightBar />

      <MobileTabBar />
    </>
  );
}
