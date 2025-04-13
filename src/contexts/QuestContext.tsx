
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  icon: string;
  completedDays: string[];
  xpReward: number;
  streak: number;
  lastCompletedDate?: string;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'award' | 'shield' | 'sword' | 'zap' | 'star' | 'trophy';
  color: string;
  type: 'achievement' | 'level' | 'streak';
  level?: number;
  dateEarned: string;
}

interface QuestContextType {
  habits: Habit[];
  quests: Quest[];
  badges: Badge[];
  addHabit: (name: string, icon: string, xpReward: number) => void;
  completeHabit: (habitId: string, day: string) => void;
  addQuest: (name: string, description: string, xpReward: number) => void;
  completeQuest: (questId: string) => void;
  resetStreakIfNeeded: () => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error("useQuest must be used within a QuestProvider");
  }
  return context;
};

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, updateUserStats } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Initialize with default habits and quests
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load user habits and quests from localStorage
      const storedUsers = localStorage.getItem("soloLevelingUsers");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const currentUser = users.find((u: any) => u.id === user.id);
        
        if (currentUser) {
          setHabits(currentUser.habits || getDefaultHabits());
          setQuests(currentUser.quests || getDefaultQuests());
          setBadges(currentUser.badges || []);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Check for missed streak days
  useEffect(() => {
    if (isAuthenticated && user) {
      resetStreakIfNeeded();
    }
  }, [isAuthenticated, user]);

  // When habits, quests or badges change, update localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedUsers = localStorage.getItem("soloLevelingUsers");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => {
          if (u.id === user.id) {
            return {
              ...u,
              habits,
              quests,
              badges
            };
          }
          return u;
        });
        
        localStorage.setItem("soloLevelingUsers", JSON.stringify(updatedUsers));
      }
    }
  }, [habits, quests, badges, isAuthenticated, user]);

  // Check and award level-up badges
  useEffect(() => {
    if (isAuthenticated && user && user.stats) {
      // Check if user already has a badge for the current level
      const hasLevelBadge = badges.some(badge => 
        badge.type === 'level' && badge.level === user.stats.level
      );

      if (!hasLevelBadge && user.stats.level > 1) {
        // Create a new level badge
        const newBadge: Badge = {
          id: `level-${user.stats.level}-${Date.now()}`,
          name: `Level ${user.stats.level}`,
          description: `Reached Hunter Level ${user.stats.level}`,
          icon: user.stats.level >= 10 ? 'trophy' : 'star',
          color: getLevelBadgeColor(user.stats.level),
          type: 'level',
          level: user.stats.level,
          dateEarned: new Date().toISOString(),
        };

        setBadges(prev => [...prev, newBadge]);
        toast.success(`New Badge Earned: Level ${user.stats.level} Hunter!`, { duration: 5000 });
      }
    }
  }, [isAuthenticated, user?.stats?.level, badges]);

  const getLevelBadgeColor = (level: number): string => {
    if (level >= 20) return 'purple';
    if (level >= 15) return 'amber';
    if (level >= 10) return 'cyan';
    if (level >= 5) return 'green';
    return 'blue';
  };

  const getDefaultHabits = (): Habit[] => {
    return [
      {
        id: "1",
        name: "Exercise",
        icon: "dumbbell",
        completedDays: [],
        xpReward: 50,
        streak: 0,
      },
      {
        id: "2",
        name: "Read",
        icon: "book-open",
        completedDays: [],
        xpReward: 30,
        streak: 0,
      },
      {
        id: "3",
        name: "No Junk Food",
        icon: "salad",
        completedDays: [],
        xpReward: 40,
        streak: 0,
      },
    ];
  };

  const getDefaultQuests = (): Quest[] => {
    return [
      {
        id: "1",
        name: "Complete 3-Day Workout Challenge",
        description: "Complete 3 consecutive days of exercise to level up your strength.",
        xpReward: 150,
        completed: false,
      },
      {
        id: "2",
        name: "Study Session",
        description: "Complete a 30-minute focused study session to increase intelligence.",
        xpReward: 100,
        completed: false,
      },
    ];
  };

  const addHabit = (name: string, icon: string, xpReward: number) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
      completedDays: [],
      xpReward,
      streak: 0,
    };
    
    setHabits((prev) => [...prev, newHabit]);
    toast.success(`New habit "${name}" created!`);
  };

  const resetStreakIfNeeded = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // Check each habit for streak maintenance
    setHabits(prev => prev.map(habit => {
      // If there's no lastCompletedDate, no need to reset streak
      if (!habit.lastCompletedDate) {
        return habit;
      }

      const lastCompletedDate = new Date(habit.lastCompletedDate);
      lastCompletedDate.setHours(0, 0, 0, 0);
      
      // If last completion wasn't yesterday, reset streak (unless completed today)
      const todayString = today.toISOString().split('T')[0];
      const isCompletedToday = habit.completedDays.includes(todayString);

      if (!isCompletedToday && lastCompletedDate.toISOString() !== yesterdayString) {
        // Only notify if the streak was significant (3 or more)
        if (habit.streak >= 3) {
          toast.error(`Oh no! You broke your ${habit.streak} day streak for "${habit.name}"`, 
            { duration: 5000 });
        }
        return { ...habit, streak: 0 };
      }
      
      return habit;
    }));
  };

  const completeHabit = (habitId: string, day: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isToday = day === today;
    
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const alreadyCompleted = habit.completedDays.includes(day);
          let updatedDays;
          let updatedStreak = habit.streak;
          
          if (alreadyCompleted) {
            // Uncompleting a habit for today
            updatedDays = habit.completedDays.filter((d) => d !== day);
            toast.info(`Marked "${habit.name}" as incomplete for today`);
            
            // If we're unmarking today's completion, adjust streak if needed
            if (isToday) {
              // Check if yesterday was completed to determine streak
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayString = yesterday.toISOString().split('T')[0];
              const isYesterdayCompleted = habit.completedDays.includes(yesterdayString);
              
              if (!isYesterdayCompleted && updatedStreak > 0) {
                updatedStreak -= 1;
              }
            }
            
            return {
              ...habit,
              completedDays: updatedDays,
              streak: updatedStreak,
              lastCompletedDate: updatedDays.length > 0 ? 
                updatedDays.sort().reverse()[0] : undefined
            };
          } else {
            // Completing a habit for today
            updatedDays = [...habit.completedDays, day].sort();
            
            // If completing for today, check if yesterday was completed to increase streak
            if (isToday) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayString = yesterday.toISOString().split('T')[0];
              const isYesterdayCompleted = habit.completedDays.includes(yesterdayString);
              
              // Increase streak if yesterday was completed or streak is 0
              if (isYesterdayCompleted || habit.streak === 0) {
                updatedStreak = habit.streak + 1;
                
                // Check for streak achievements
                if (updatedStreak === 3 || updatedStreak === 7 || 
                    updatedStreak === 14 || updatedStreak === 30 || 
                    updatedStreak === 60 || updatedStreak === 100) {
                  
                  const streakBadge: Badge = {
                    id: `streak-${habit.id}-${updatedStreak}-${Date.now()}`,
                    name: `${updatedStreak} Day Streak`,
                    description: `Completed "${habit.name}" for ${updatedStreak} days in a row!`,
                    icon: getStreakBadgeIcon(updatedStreak),
                    color: getStreakBadgeColor(updatedStreak),
                    type: 'streak',
                    dateEarned: new Date().toISOString(),
                  };
                  
                  // Add the streak badge
                  setBadges(prev => [...prev, streakBadge]);
                  
                  // Give bonus XP for streak achievements
                  const bonusXP = Math.floor(habit.xpReward * (updatedStreak / 3));
                  updateUserStats(bonusXP);
                  
                  toast.success(
                    `🔥 ${updatedStreak} DAY STREAK! "${habit.name}" +${bonusXP} bonus XP!`, 
                    { duration: 5000 }
                  );
                }
              }
            }
            
            toast.success(`Completed "${habit.name}" today! +${habit.xpReward} XP`);
            
            // Update user XP when completing a habit
            updateUserStats(habit.xpReward);
            
            // Also add some gold
            const goldAmount = Math.floor(habit.xpReward / 2);
            updateUserStats(0, { gold: (user?.gold || 0) + goldAmount });
            toast.success(`Earned ${goldAmount} gold!`, { duration: 3000 });
          }
          
          return {
            ...habit,
            completedDays: updatedDays,
            streak: updatedStreak,
            lastCompletedDate: isToday && !alreadyCompleted ? today : habit.lastCompletedDate
          };
        }
        return habit;
      })
    );
  };

  const getStreakBadgeIcon = (streak: number): 'award' | 'shield' | 'sword' | 'zap' | 'star' | 'trophy' => {
    if (streak >= 100) return 'trophy';
    if (streak >= 30) return 'award';
    if (streak >= 14) return 'sword';
    return 'zap';
  };

  const getStreakBadgeColor = (streak: number): string => {
    if (streak >= 100) return 'purple';
    if (streak >= 60) return 'amber';
    if (streak >= 30) return 'cyan';
    if (streak >= 14) return 'green';
    return 'blue';
  };

  const addQuest = (name: string, description: string, xpReward: number) => {
    const newQuest: Quest = {
      id: Date.now().toString(),
      name,
      description,
      xpReward,
      completed: false,
    };
    
    setQuests((prev) => [...prev, newQuest]);
    toast.success(`New quest "${name}" created!`);
  };

  const completeQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === questId && !quest.completed) {
          toast.success(`Quest "${quest.name}" completed! +${quest.xpReward} XP`);
          
          // Update user XP when completing a quest
          updateUserStats(quest.xpReward);
          
          // Also add some gold
          const goldAmount = quest.xpReward;
          updateUserStats(0, { gold: (user?.gold || 0) + goldAmount });
          toast.success(`Earned ${goldAmount} gold!`, { duration: 3000 });
          
          // Add achievement badge
          const questBadge: Badge = {
            id: `quest-${questId}-${Date.now()}`,
            name: `${quest.name}`,
            description: `Completed the quest: ${quest.name}`,
            icon: 'shield',
            color: 'green',
            type: 'achievement',
            dateEarned: new Date().toISOString(),
          };
          
          setBadges(prev => [...prev, questBadge]);
          
          return {
            ...quest,
            completed: true,
          };
        }
        return quest;
      })
    );
  };

  return (
    <QuestContext.Provider
      value={{ 
        habits, 
        quests, 
        badges,
        addHabit, 
        completeHabit, 
        addQuest, 
        completeQuest,
        resetStreakIfNeeded
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
