import React from "react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import {
  Flame,
  Brain,
  ActivitySquare,
  Coins,
} from "lucide-react";

const StatusCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const { stats } = user;
  const xpPercentage = (stats.currentXP / stats.maxXP) * 100;

  return (
    <div className="w-full rounded-xl border border-solo-cyan p-4 bg-[#0c0f1d] text-white font-orbitron shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-solo-cyan drop-shadow-md">
            {user.username}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-fuchsia-400">{stats.rank}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-solo-cyan drop-shadow-md">Level {stats.level}</div>
          <div className="flex items-center justify-end mt-1">
            <Coins className="h-4 w-4 text-amber-300 mr-1" />
            <span className="text-amber-300 font-semibold">{user.gold || 0}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm text-slate-300">
          <span>XP</span>
          <span>
            {stats.currentXP} / {stats.maxXP}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-solo-blue to-solo-cyan"
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <StatItem
          icon={<Flame className="h-5 w-5 text-orange-500 mx-auto" />}
          label="Strength"
          value={stats.strength}
        />
        <StatItem
          icon={<Brain className="h-5 w-5 text-solo-blue mx-auto" />}
          label="Intelligence"
          value={stats.intelligence}
        />
        <StatItem
          icon={<ActivitySquare className="h-5 w-5 text-teal-400 mx-auto" />}
          label="Dexterity"
          value={stats.dexterity}
        />
      </div>
    </div>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const StatItem = ({ icon, label, value }: StatItemProps) => {
  return (
    <div className="bg-[#13182b] rounded-md py-2 shadow-inner">
      <div>{icon}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
      <div className="text-lg font-bold text-white mt-1">{value}</div>
    </div>
  );
};

export default StatusCard;

// Add this to your global CSS or Tailwind config
// @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');
// .font-orbitron { font-family: 'Orbitron', sans-serif; }
