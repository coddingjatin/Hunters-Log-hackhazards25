
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { 
  Flame, 
  Brain, 
  ActivitySquare,
  Coins 
} from "lucide-react";

const StatusCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const { stats } = user;
  const xpPercentage = (stats.currentXP / stats.maxXP) * 100;

  return (
    <div className="solo-card w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold solo-glow-text">
            {user.username}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-solo-magenta">{stats.rank}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold solo-glow-text">Level {stats.level}</div>
          <div className="flex items-center justify-end mt-1">
            <Coins className="h-4 w-4 text-amber-300 mr-1" />
            <span className="text-amber-300">{user.gold || 0}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm">
          <span>XP</span>
          <span>{stats.currentXP} / {stats.maxXP}</span>
        </div>
        <Progress value={xpPercentage} className="h-2 bg-slate-700">
          <div
            className="h-full bg-gradient-to-r from-solo-blue to-solo-cyan"
            style={{ width: `${xpPercentage}%` }}
          />
        </Progress>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <StatItem
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          label="Strength"
          value={stats.strength}
        />
        <StatItem
          icon={<Brain className="h-5 w-5 text-solo-blue" />}
          label="Intelligence"
          value={stats.intelligence}
        />
        <StatItem
          icon={<ActivitySquare className="h-5 w-5 text-teal-500" />}
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
    <div className="text-center p-2">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-sm text-slate-300">{label}</div>
      <div className="font-bold text-xl text-white">{value}</div>
    </div>
  );
};

export default StatusCard;
