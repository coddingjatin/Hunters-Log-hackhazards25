
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
    // Check if the daily quest was already started today
    const lastQuestDay = localStorage.getItem("soloLevelingLastQuestDay");
    const today = new Date().toDateString();
    
    if (lastQuestDay === today) {
      setShowDailyQuest(true);
    }
  }, []);
  
  const handleStartDailyQuest = () => {
    setShowDailyQuest(true);
    // Save the day when the quest was started
    localStorage.setItem("soloLevelingLastQuestDay", new Date().toDateString());
    
    toast.success("Daily quest started! Complete your habits to earn rewards.", {
      duration: 4000,
    });
  };
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-solo-bg">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold solo-glow-text">
              WELCOME, HUNTER
            </h1>
          </div>
          
          {/* Daily Quest Button */}
          {!showDailyQuest && (
            <div className="mb-8 text-center">
              <Button 
                onClick={handleStartDailyQuest}
                className="solo-button text-lg py-6 px-12 animate-pulse-glow"
              >
                START DAILY QUEST
              </Button>
            </div>
          )}
          
          {/* Main Content */}
          {showDailyQuest ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StatusCard />
                <HabitsTracker />
                <BadgesCard />
              </div>
              
              <div className="space-y-6">
                <QuestsCard />
                <ItemsCard />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StatusCard />
              </div>
              
              <div>
                <ItemsCard />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
