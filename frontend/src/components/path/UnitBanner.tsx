import { Button } from "@/components/ui/Button";
import { BookOpen, ArrowLeft } from "lucide-react";

interface UnitBannerProps {
  title: string;
  description: string;
  color: string;
}

export function UnitBanner({ title, description, color }: UnitBannerProps) {
  const colorMap: Record<string, string> = {
    "duo-green": "bg-duo-green",
    "duo-orange": "bg-duo-orange",
    "duo-blue": "bg-duo-blue",
    "duo-red": "bg-duo-red",
    "duo-yellow": "bg-duo-yellow",
    "duo-purple": "bg-duo-purple",
  };
  const bgClass = colorMap[color] || "bg-duo-green";

  return (
    <div className={`w-full rounded-xl ${bgClass} p-4 lg:p-5 flex items-center justify-between text-white`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-white/90 font-bold text-sm lg:text-base mb-1">
          <ArrowLeft size={20} className="cursor-pointer hover:opacity-75 transition-opacity" />
          <span>SECTION 1, {title.toUpperCase()}</span>
        </div>
        <h3 className="text-xl lg:text-2xl font-bold">{description}</h3>
      </div>
      <Button size="lg" variant="ghost" className="hidden lg:flex border-2 border-b-4 border-white text-white hover:bg-white/20 active:border-b-2" onClick={() => alert("Guidebook feature coming soon!")}>
        <BookOpen className="mr-2" />
        Guidebook
      </Button>
    </div>
  );
}
