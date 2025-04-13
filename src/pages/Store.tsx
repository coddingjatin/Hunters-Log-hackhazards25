
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Coins, ShoppingCart, Check } from "lucide-react";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "potion" | "equipment" | "skill";
  effect: string;
  imagePath: string;
}

const Store = () => {
  const { user, updateUserStats } = useAuth();
  const [items] = useState<StoreItem[]>([
    {
      id: "1",
      name: "Elixir of Strength",
      description: "Increases strength by 5 points",
      price: 150,
      type: "potion",
      effect: "strength",
      imagePath: "/assets/potion-red.png",
    },
    {
      id: "2",
      name: "Intelligence Scroll",
      description: "Increases intelligence by 5 points",
      price: 150,
      type: "potion",
      effect: "intelligence",
      imagePath: "/assets/potion-blue.png",
    },
    {
      id: "3",
      name: "Dexterity Tonic",
      description: "Increases dexterity by 5 points",
      price: 150,
      type: "potion",
      effect: "dexterity",
      imagePath: "/assets/potion-green.png",
    },
    {
      id: "4",
      name: "XP Boost",
      description: "Instantly gain 500 XP",
      price: 300,
      type: "potion",
      effect: "xp",
      imagePath: "/assets/potion-purple.png",
    },
    {
      id: "5",
      name: "Basic Sword",
      description: "A standard sword for hunters",
      price: 500,
      type: "equipment",
      effect: "weapon",
      imagePath: "/assets/sword.png",
    },
    {
      id: "6",
      name: "Shadow Extraction",
      description: "Extract a shadow from defeated enemies",
      price: 1000,
      type: "skill",
      effect: "shadow",
      imagePath: "/assets/shadow.png",
    }
  ]);

  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  
  const purchaseItem = (item: StoreItem) => {
    if (!user) return;
    
    // Check if user has enough gold
    const goldAmount = user.gold || 0;
    
    if (goldAmount < item.price) {
      toast.error("Not enough gold to purchase this item!");
      return;
    }
    
    // Apply the item effect based on type
    let statsUpdate: any = {
      gold: goldAmount - item.price
    };
    
    switch (item.effect) {
      case "strength":
        statsUpdate.strength = user.stats.strength + 5;
        break;
      case "intelligence":
        statsUpdate.intelligence = user.stats.intelligence + 5;
        break;
      case "dexterity":
        statsUpdate.dexterity = user.stats.dexterity + 5;
        break;
      case "xp":
        // XP will be handled by the updateUserXp function
        updateUserStats(500);
        break;
      case "shadow":
        // Shadow will be handled in the shadow soldiers page
        break;
    }
    
    // Update user stats with the new values
    updateUserStats(0, statsUpdate);
    
    // Add to purchased items
    setPurchasedItems([...purchasedItems, item.id]);
    
    toast.success(`Successfully purchased ${item.name}!`);
  };
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-solo-bg">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold solo-glow-text">
              HUNTER STORE
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-amber-300 text-lg">
                <Coins className="h-5 w-5 mr-2" />
                <span>{user.gold || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="solo-card flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-solo-blue/20 rounded-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-solo-blue/60 to-solo-magenta/30 animate-pulse-glow" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-center mb-2 solo-glow-text">{item.name}</h2>
                  <p className="text-slate-300 text-center mb-4">{item.description}</p>
                  
                  <div className="flex justify-center items-center mb-4">
                    <span className="flex items-center text-amber-300 text-lg">
                      <Coins className="h-5 w-5 mr-2" />
                      {item.price}
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={() => purchaseItem(item)}
                  disabled={purchasedItems.includes(item.id)}
                  className={`w-full ${purchasedItems.includes(item.id) ? 'bg-green-600 hover:bg-green-600' : 'solo-button'}`}
                >
                  {purchasedItems.includes(item.id) ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Purchased
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" /> Purchase
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Store;
