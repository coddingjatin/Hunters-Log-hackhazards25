import React from "react";
import { useQuest } from "../contexts/QuestContext";
import Badge from "./Badge";

const BadgesCard = () => {
  const { badges } = useQuest();

  // Group badges by type
  const levelBadges = badges.filter(badge => badge.type === 'level');
  const streakBadges = badges.filter(badge => badge.type === 'streak');
  const achievementBadges = badges.filter(badge => badge.type === 'achievement');

  // Sort badges by date earned (most recent first)
  const sortBadges = (badgeArray: any[]) => {
    return [...badgeArray].sort((a, b) => {
      return new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime();
    });
  };

  // Filter duplicates based on level and name
  const filterDuplicateBadges = (badges: any[]) => {
    const uniqueBadges = [];
    const seen = new Set();

    badges.forEach(badge => {
      const uniqueKey = `${badge.name}-${badge.level}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        uniqueBadges.push(badge);
      }
    });

    return uniqueBadges;
  };

  return (
    <div className="solo-card w-full">
      <h2 className="text-xl font-bold solo-glow-text mb-4">My Badges</h2>
      
      {badges.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No badges yet. Complete tasks and level up to earn badges!
        </div>
      ) : (
        <div className="space-y-6">
          {levelBadges.length > 0 && (
            <div>
              <h3 className="text-sm text-slate-400 mb-2">Level Badges</h3>
              <div className="flex flex-wrap gap-2">
                {sortBadges(filterDuplicateBadges(levelBadges)).map(badge => (
                  <Badge
                    key={badge.id}
                    type={badge.type}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    color={badge.color}
                    level={badge.level}
                  />
                ))}
              </div>
            </div>
          )}
          
          {streakBadges.length > 0 && (
            <div>
              <h3 className="text-sm text-slate-400 mb-2">Streak Badges</h3>
              <div className="flex flex-wrap gap-2">
                {sortBadges(filterDuplicateBadges(streakBadges)).map(badge => (
                  <Badge
                    key={badge.id}
                    type={badge.type}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    color={badge.color}
                  />
                ))}
              </div>
            </div>
          )}
          
          {achievementBadges.length > 0 && (
            <div>
              <h3 className="text-sm text-slate-400 mb-2">Achievement Badges</h3>
              <div className="flex flex-wrap gap-2">
                {sortBadges(filterDuplicateBadges(achievementBadges)).map(badge => (
                  <Badge
                    key={badge.id}
                    type={badge.type}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    color={badge.color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BadgesCard;
