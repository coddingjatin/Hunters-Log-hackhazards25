
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, UserPlus, Shield, Sword, UserMinus, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Friend {
  id: string;
  name: string;
  level: number;
  characterClass: string;
  strength: number;
  intelligence: number;
  dexterity: number;
  online: boolean;
  lastActive: string;
}

const ShadowSoldiers = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFriend, setNewFriend] = useState({
    name: "",
    email: "",
  });
  
  // Load friends from localStorage or use empty array
  const [friends, setFriends] = useState<Friend[]>(() => {
    if (!user) return [];
    
    const storedUsers = localStorage.getItem("soloLevelingUsers");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const currentUser = users.find((u: any) => u.id === user.id);
      return currentUser?.friends || [];
    }
    
    return [];
  });
  
  const addFriend = () => {
    if (!user) return;
    if (!newFriend.name.trim()) {
      toast.error("Please enter a name for your friend");
      return;
    }
    
    if (!newFriend.email.trim() || !newFriend.email.includes('@')) {
      toast.error("Please enter a valid email for your friend");
      return;
    }
    
    const characterClasses = ["Rookie Hunter", "Mage Hunter", "Assassin Hunter", "Shadow Monarch"];
    const randomClass = characterClasses[Math.floor(Math.random() * characterClasses.length)];
    
    const newFriendData: Friend = {
      id: Date.now().toString(),
      name: newFriend.name,
      level: Math.floor(Math.random() * 10) + 1,
      characterClass: randomClass,
      strength: Math.floor(Math.random() * 10) + 1,
      intelligence: Math.floor(Math.random() * 10) + 1,
      dexterity: Math.floor(Math.random() * 10) + 1,
      online: Math.random() > 0.5,
      lastActive: new Date().toISOString(),
    };
    
    const updatedFriends = [...friends, newFriendData];
    setFriends(updatedFriends);
    
    // Save to localStorage
    const storedUsers = localStorage.getItem("soloLevelingUsers");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            friends: updatedFriends,
          };
        }
        return u;
      });
      
      localStorage.setItem("soloLevelingUsers", JSON.stringify(updatedUsers));
    }
    
    setNewFriend({ name: "", email: "" });
    setIsDialogOpen(false);
    toast.success(`${newFriend.name} has been added to your Shadow army!`);
  };
  
  const removeFriend = (friendId: string) => {
    if (!user) return;
    
    const friendToRemove = friends.find(f => f.id === friendId);
    if (!friendToRemove) return;
    
    const updatedFriends = friends.filter(f => f.id !== friendId);
    setFriends(updatedFriends);
    
    // Save to localStorage
    const storedUsers = localStorage.getItem("soloLevelingUsers");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            friends: updatedFriends,
          };
        }
        return u;
      });
      
      localStorage.setItem("soloLevelingUsers", JSON.stringify(updatedUsers));
    }
    
    toast.success(`${friendToRemove.name} has been removed from your Shadow army.`);
  };
  
  const getClassIcon = (characterClass: string) => {
    switch (characterClass) {
      case "Mage Hunter":
        return <Shield className="h-5 w-5 text-blue-500" />;
      case "Assassin Hunter":
        return <Sword className="h-5 w-5 text-green-500" />;
      case "Shadow Monarch":
        return <Shield className="h-5 w-5 text-purple-500" />;
      default:
        return <Sword className="h-5 w-5 text-red-500" />;
    }
  };
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-solo-bg">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold solo-glow-text">
              SHADOW ARMY
            </h1>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="solo-button">
                  <UserPlus className="h-4 w-4 mr-2" /> Add Friend
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-solo-dark border-solo-blue/50">
                <DialogHeader>
                  <DialogTitle className="solo-glow-text">Add New Friend</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm">Friend's Name</label>
                    <Input
                      value={newFriend.name}
                      onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                      placeholder="Enter friend's name"
                      required
                      className="solo-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Friend's Email</label>
                    <Input
                      value={newFriend.email}
                      onChange={(e) => setNewFriend({ ...newFriend, email: e.target.value })}
                      placeholder="Enter friend's email"
                      type="email"
                      required
                      className="solo-input"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" className="solo-button" onClick={addFriend}>
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {friends.length === 0 ? (
            <div className="solo-card p-10 text-center">
              <h2 className="text-xl font-semibold mb-4">No Shadows In Your Army Yet</h2>
              <p className="text-slate-400 mb-6">
                As a hunter, you have the ability to gather a shadow army.
                Add friends to your shadow army to track their progress and collaborate on quests.
              </p>
              <Button className="solo-button" onClick={() => setIsDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" /> Add Your First Shadow Friend
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map((friend) => (
                <div key={friend.id} className="solo-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-solo-blue/20 flex items-center justify-center">
                      <User className={`h-6 w-6 ${friend.online ? 'text-green-500' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h2 className="text-xl font-bold solo-glow-text mr-2">{friend.name}</h2>
                        <div className={`w-2 h-2 rounded-full ${friend.online ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-slate-400">{friend.characterClass}</span>
                        <span className="mx-2">•</span>
                        <span className="text-solo-magenta">Level {friend.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">STR</div>
                      <div className="font-bold text-lg">{friend.strength}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">INT</div>
                      <div className="font-bold text-lg">{friend.intelligence}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">DEX</div>
                      <div className="font-bold text-lg">{friend.dexterity}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-solo-blue/20 hover:bg-solo-blue/30 text-solo-blue">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Arise
                    </Button>
                    <Button
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-500"
                      onClick={() => removeFriend(friend.id)}
                    >
                      <UserMinus className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShadowSoldiers;
