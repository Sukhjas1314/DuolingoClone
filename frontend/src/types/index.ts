export interface UserStats {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  hearts: number;
  gems: number;
  daily_xp_goal: number;
  xp_today: number;
  league: string;
}

export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar: string;
  stats: UserStats;
  achievements?: string[];
}

export interface Skill {
  id: number;
  title: string;
  icon: string;
  total_levels: number;
  status: "locked" | "available" | "in_progress" | "completed";
  levels_completed: number;
  crowns: number;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  color: string;
  skills: Skill[];
}

export interface Path {
  units: Unit[];
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  display_name: string;
  avatar: string;
  weekly_xp: number;
  rank: number;
}
