import { useState, useEffect } from "react";
import { useQuest } from "../contexts/QuestContext";
import { Button } from "@/components/ui/button";
import { Flame, Plus, CheckCircle, Circle, Dumbbell, BookOpen, ScrollText, Code, Brain } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const iconComponents: Record<string, React.ReactNode> = {
  dumbbell: <Dumbbell className="h-5 w-5" />,
  "book-open": <BookOpen className="h-5 w-5" />,
  scroll: <ScrollText className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  brain: <Brain className="h-5 w-5" />,
};

const iconOptions = [
  { value: "dumbbell", label: "Exercise" },
  { value: "book-open", label: "Read" },
  { value: "scroll", label: "Study" },
  { value: "code", label: "Code" },
  { value: "brain", label: "Mental" },
];

const HabitsTracker = () => {
  const { habits, completeHabit, addHabit, resetStreakIfNeeded } = useQuest();
  const [isOpen, setIsOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    icon: "dumbbell",
    xpReward: 25,
  });

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.

  // Check for streak resets each day
  useEffect(() => {
    resetStreakIfNeeded();

    // Set up a daily check at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightCheck = setTimeout(() => {
      resetStreakIfNeeded();
    }, timeUntilMidnight);

    return () => clearTimeout(midnightCheck);
  }, [resetStreakIfNeeded]);

  const getDayString = (dayIndex: number) => {
    const date = new Date();
    date.setDate(date.getDate() - (currentDay - dayIndex));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  const isHabitCompletedOnDay = (habit: any, dayIndex: number) => {
    const dayString = getDayString(dayIndex);
    return habit.completedDays.includes(dayString);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHabit(newHabit.name, newHabit.icon, newHabit.xpReward);
    setNewHabit({ name: "", icon: "dumbbell", xpReward: 50 });
    setIsOpen(false);
  };

  return (
    <div className="solo-card w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold solo-glow-text">My Habits</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="solo-button !p-2">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[90vw] bg-solo-dark border-solo-blue/50 p-6">
          <DialogHeader>
  <DialogTitle className="solo-glow-text text-center w-full" style={{ textAlign: 'center' }}>
  </DialogTitle>
</DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm">Habit Name</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="Enter habit name"
                  required
                  className="solo-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Icon</label>
                <Select
                  value={newHabit.icon}
                  onValueChange={(value) => setNewHabit({ ...newHabit, icon: value })}
                >
                  <SelectTrigger className="solo-input">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent className="bg-solo-dark border-solo-blue">
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {iconComponents[option.value]}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">XP Reward</label>
                <Input
                  type="number"
                  min="1"
                  max="25"
                  value={newHabit.xpReward}
                  onChange={(e) => setNewHabit({ ...newHabit, xpReward: parseInt(e.target.value) })}
                  required
                  className="solo-input"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="solo-button">
                  Create Habit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left font-normal text-slate-400 pb-4 pl-2">Habit</th>
              {days.map((day, i) => (
                <th key={i} className="text-center font-normal text-slate-400 pb-4 w-10">
                  {day}
                </th>
              ))}
              <th className="text-center font-normal text-slate-400 pb-4 px-2">Streak</th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400">
                  No habits yet. Add some to track your progress!
                </td>
              </tr>
            ) : (
              habits.map((habit) => (
                <tr key={habit.id} className="border-t border-slate-700/30">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="text-solo-blue">
                        {iconComponents[habit.icon] || <Circle className="h-5 w-5" />}
                      </div>
                      <span>{habit.name}</span>
                    </div>
                  </td>
                  {days.map((day, dayIndex) => {
                    const isCompleted = isHabitCompletedOnDay(habit, dayIndex);
                    const dayString = getDayString(dayIndex);
                    return (
                      <td key={dayIndex} className="text-center">
                        <button
                          onClick={() => completeHabit(habit.id, dayString)}
                          disabled={dayIndex > currentDay} // Can't complete future days
                          className={cn(
                            "transition-all duration-300",
                            dayIndex > currentDay && "opacity-30" // Future days
                          )}
                        >
                          {isCompleted ? (
                            <div className="rounded-full w-8 h-8 flex items-center justify-center bg-solo-blue">
                              <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                          ) : (
                            <div className="rounded-full w-8 h-8 flex items-center justify-center border border-solo-blue/50">
                              <Circle className="h-6 w-6 text-solo-blue/50" />
                            </div>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="text-center">
                    <div className="flex items-center justify-center">
                      <div className={cn(
                        "px-2 py-1 rounded-full flex items-center gap-1",
                        habit.streak > 0 ? "bg-solo-blue/20" : "bg-slate-700/20"
                      )}>
                        <Flame className={cn(
                          "h-4 w-4",
                          habit.streak >= 7 ? "text-red-500" : 
                          habit.streak >= 3 ? "text-orange-400" : "text-slate-400"
                        )} />
                        <span className={cn(
                          "font-medium",
                          habit.streak >= 7 ? "text-red-500" : 
                          habit.streak >= 3 ? "text-orange-400" : "text-slate-400"
                        )}>
                          {habit.streak}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="ghost" 
          className="px-4 py-2 text-solo-blue hover:bg-solo-blue/10 hover:text-solo-cyan"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Habit
        </Button>
      </div>
    </div>
  );
};

export default HabitsTracker;
