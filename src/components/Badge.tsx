import React from 'react';
import { Badge as UiBadge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Shield, Sword, Zap, Star, Trophy } from "lucide-react";

export interface BadgeProps {
  type: 'achievement' | 'level' | 'streak';
  name: string;
  description: string;
  icon?: 'award' | 'shield' | 'sword' | 'zap' | 'star' | 'trophy';
  color?: string;
  level?: number;
}

const Badge = ({ type, name, description, icon = 'award', color = 'blue', level }: BadgeProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'award': return <Award className="h-5 w-5" />;
      case 'shield': return <Shield className="h-5 w-5" />;
      case 'sword': return <Sword className="h-5 w-5" />;
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      case 'trophy': return <Trophy className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'purple': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'green': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'amber': return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      case 'cyan': return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50';
      case 'red': return 'bg-red-500/20 text-red-500 border-red-500/50';
      default: return 'bg-solo-blue/20 text-solo-blue border-solo-blue/50';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <UiBadge
            className={`px-3 py-2 border ${getBgColor()} flex items-center gap-1.5`}
            variant="outline"
          >
            {getIcon()}
            <span>
              {name}
              {/* Only append level for "level" type badges, and ensure it’s not in the name already */}
              {type === 'level' && level && !name.includes(`Level ${level}`) && ` - Level ${level}`}
            </span>
          </UiBadge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Badge;
