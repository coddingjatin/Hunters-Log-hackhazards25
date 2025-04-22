"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import StatusCard from "@/components/StatusCard";
import QuestsCard from "@/components/QuestsCard";
import HabitsTracker from "@/components/HabitsTracker";
import ItemsCard from "@/components/ItemsCard";
import BadgesCard from "@/components/BadgesCard";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [showDailyQuest, setShowDailyQuest] = useState(false);

  useEffect(() => {
    const lastQuestDay = localStorage.getItem("soloLevelingLastQuestDay");
    const today = new Date().toDateString();
    if (lastQuestDay === today) {
      setShowDailyQuest(true);
    }
  }, []);

  const handleStartDailyQuest = () => {
    setShowDailyQuest(true);
    localStorage.setItem("soloLevelingLastQuestDay", new Date().toDateString());
    toast.success("Daily quest started! Complete your habits to earn rewards.", {
      duration: 40000,
    });
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#0B1120] font-orbitron text-white">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <main className="p-8 md:p-12 lg:p-16 space-y-12">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-extrabold text-cyan-400 solo-glow-text tracking-wider">
              WELCOME, HUNTER
            </h1>
          </div>

          {/* Daily Quest Button */}
          {!showDailyQuest && (
            <div className="text-center">
              <Button
                onClick={handleStartDailyQuest}
                className="text-xl py-5 px-10 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg shadow-md shadow-cyan-500/30 animate-pulse-glow transition duration-300"
              >
                START DAILY QUEST
              </Button>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <StatusCard />
              {showDailyQuest && <HabitsTracker />}
              {showDailyQuest && <BadgesCard />}
            </div>

            <div className="space-y-10">
              {showDailyQuest && <QuestsCard />}
              <ItemsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
