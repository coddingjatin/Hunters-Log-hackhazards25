
import { Plus, Check, X } from "lucide-react";
import { useQuest } from "../contexts/QuestContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const QuestsCard = () => {
  const { quests, completeQuest, addQuest } = useQuest();
  const [isOpen, setIsOpen] = useState(false);
  const [newQuest, setNewQuest] = useState({
    name: "",
    description: "",
    xpReward: 100,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuest(newQuest.name, newQuest.description, newQuest.xpReward);
    setNewQuest({ name: "", description: "", xpReward: 100 });
    setIsOpen(false);
  };

  const activeQuests = quests.filter(quest => !quest.completed);
  const completedQuests = quests.filter(quest => quest.completed);

  return (
    <div className="solo-card w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold solo-glow-text">Daily Quests</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="solo-button !p-2">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-solo-dark border-solo-blue/50">
            <DialogHeader>
              <DialogTitle className="solo-glow-text">Add New Quest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm">Quest Name</label>
                <Input
                  value={newQuest.name}
                  onChange={(e) => setNewQuest({ ...newQuest, name: e.target.value })}
                  placeholder="Enter quest name"
                  required
                  className="solo-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Description</label>
                <Textarea
                  value={newQuest.description}
                  onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                  placeholder="Enter quest description"
                  required
                  className="solo-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">XP Reward</label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={newQuest.xpReward}
                  onChange={(e) => setNewQuest({ ...newQuest, xpReward: parseInt(e.target.value) })}
                  required
                  className="solo-input"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="solo-button">
                  Create Quest
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {activeQuests.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            No active quests. Add some quests to begin your journey!
          </div>
        ) : (
          activeQuests.map((quest) => (
            <div
              key={quest.id}
              className="border border-solo-blue/30 bg-black/40 rounded-md p-3 flex justify-between"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">{quest.name}</h3>
                <p className="text-sm text-slate-400">{quest.description}</p>
                <div className="text-xs text-solo-blue mt-1">+{quest.xpReward} XP</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 h-8 w-8 p-0 rounded-full"
                onClick={() => completeQuest(quest.id)}
              >
                <Check className="h-4 w-4 text-green-500" />
                <span className="sr-only">Complete</span>
              </Button>
            </div>
          ))
        )}

        {completedQuests.length > 0 && (
          <>
            <div className="border-t border-solo-blue/20 my-4 pt-4">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Completed Quests</h3>
              {completedQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="border border-slate-700 bg-black/20 rounded-md p-3 flex justify-between mb-2 opacity-60"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-300 line-through">{quest.name}</h3>
                    <div className="text-xs text-solo-blue mt-1">+{quest.xpReward} XP</div>
                  </div>
                  <div className="shrink-0 h-8 w-8 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestsCard;
