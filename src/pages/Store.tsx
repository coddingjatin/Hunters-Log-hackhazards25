import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Coins, ShoppingCart, Check, X } from "lucide-react";
import holyportion from "public/holyportion.png";
import elix from "public/elix.jpg";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "potion" | "equipment" | "skill";
  effect: string;
  imagePath: string;
  itemClass?: string;
}

// Add the Orbitron font face
const fontStyle = `
  @font-face {
    font-family: 'Orbitron';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyKS6BoWgz.woff2) format('woff2');
    unicode-range: U+0000-00FF;
  }
`;

const Store = () => {
  const { user, updateUserStats } = useAuth();
  const [items] = useState<StoreItem[]>([
    {
      id: "p0",
      name: "Holy Water of Life",
      description: "A mysterious potion that can cure any disease with powerful magic. The effect will only take place when the entire bottle is been consumed.",
      price: 500,
      type: "potion",
      effect: "heal-all",
      imagePath: "public/holyportion.png",
      itemClass: "S",
    },
    {
      id: "p1",
      name: "Potion of Strength",
      description: "Boost your strength by +5 instantly.",
      price: 150,
      type: "potion",
      effect: "strength",
      imagePath: "stre.jpg",
      itemClass: "A",
    },
    {
      id: "p2",
      name: "Elixir of Intelligence",
      description: "Sharpen your mind with +5 intelligence.",
      price: 150,
      type: "potion",
      effect: "intelligence",
      imagePath: "public/elix.jpg",
      itemClass: "A",
    },
    {
      id: "p3",
      name: "Agility Brew",
      description: "Increases dexterity by +5 for nimble moves.",
      price: 150,
      type: "potion",
      effect: "dexterity",
      imagePath: "elixx.jpeg",
      itemClass: "A",
    },
    {
      id: "s1",
      name: "Mind Surge",
      description: "Gain 500 XP instantly.",
      price: 250,
      type: "skill",
      effect: "xp",
      imagePath: "mind.jpeg",
      itemClass: "B",
    },
    {
      id: "e2",
      name: "Shadow Cloak",
      description: "A cloak that enhances your agility.",
      price: 300,
      type: "equipment",
      effect: "dexterity",
      imagePath: "public/shadow.jpg",
      itemClass: "S",
    },
  ]);

  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const purchaseItem = (item: StoreItem) => {
    if (!user) return;
    const goldAmount = user.gold || 0;
    if (goldAmount < item.price) {
      toast.error("Not enough gold to purchase this item!");
      return;
    }

    let statsUpdate: any = { gold: goldAmount - item.price };
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
        updateUserStats(500);
        break;
      case "heal-all":
        toast.success("All ailments have been cured by the Holy Water of Life!");
        break;
    }

    updateUserStats(0, statsUpdate);
    setPurchasedItems([...purchasedItems, item.id]);
    toast.success(`Successfully purchased ${item.name}!`);
  };

  if (!user) return null;

  const getItemTypeName = (type: string) => {
    switch (type) {
      case "potion": return "CONSUMABLE";
      case "equipment": return "EQUIPMENT";
      case "skill": return "SKILL";
      default: return type.toUpperCase();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontStyle }} />
      
      <div className="flex min-h-screen bg-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
        <Sidebar />
        <div className="flex-1 overflow-auto p-10">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-5xl font-extrabold tracking-wide text-amber-400 drop-shadow-xl">Hunter Store</h1>
            <div className="flex items-center gap-2 text-amber-400 text-xl">
              <Coins className="h-6 w-6" />
              <span>{user.gold || 0}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div 
                key={item.id}
                className="cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {/* 💙 Glowing Blue Card */}
                <div className="bg-gray-900 border border-blue-400 rounded hover:bg-gray-800 transition-all duration-200 shadow-[0_0_10px_2px_rgba(0,191,255,0.6)] hover:shadow-[0_0_20px_4px_rgba(0,191,255,0.9)]">
                  <div className="flex items-center p-4 gap-4">
                    {/* 💙 Glowing Image Container */}
                    <div className="w-16 h-16 border border-blue-400 flex items-center justify-center bg-gray-800 shadow-[0_0_8px_2px_rgba(0,191,255,0.6)]">
                      <img src={item.imagePath} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-cyan-300 font-bold text-x1 tracking-wide">{item.name}</h3>
                      <p className="text-cyan-200/90 text-sm">Class: {item.itemClass}</p>
                    </div>
                    <div className="flex items-center text-cyan-300 font-medium">
                      <Coins className="h-4 w-4 mr-1" />
                      <span>{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <div className="w-full max-w-2xl p-1">
              <div className="relative w-full bg-gray-900 border-2 border-blue-400/50 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: "linear-gradient(45deg, #38bdf8 25%, transparent 25%, transparent 50%, #38bdf8 50%, #38bdf8 75%, transparent 75%, transparent)",
                    backgroundSize: "8px 8px"
                  }}></div>
                </div>
                
                <div className="relative">
                  <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-blue-400/30">
                    <h2 className="text-xl font-bold text-cyan-300">ITEM</h2>
                    <button 
                      className="text-cyan-300 hover:text-cyan-200"
                      onClick={() => setSelectedItem(null)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <div className="w-32 h-32 border-2 border-blue-400/50 bg-black/30 flex items-center justify-center mr-6 shadow-[0_0_12px_rgba(0,191,255,0.7)]">
                          <img src={selectedItem.imagePath} alt={selectedItem.name} className="w-24 h-24 object-contain" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-cyan-300 uppercase tracking-wide">[{selectedItem.name}]</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-cyan-300 font-medium">ITEM CLASS: {selectedItem.itemClass || "C"}</p>
                            <p className="text-cyan-300 font-medium">TYPE: {getItemTypeName(selectedItem.type)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8">
                        <p className="text-cyan-300 uppercase leading-relaxed font-medium tracking-wide">
                          {selectedItem.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={() => {
                          purchaseItem(selectedItem);
                          setSelectedItem(null);
                        }}
                        disabled={purchasedItems.includes(selectedItem.id)}
                        className={`px-8 py-2 rounded font-bold tracking-wide ${
                          purchasedItems.includes(selectedItem.id) 
                            ? 'bg-green-600 hover:bg-green-600 text-white' 
                            : 'bg-cyan-300 hover:bg-cyan-200 text-gray-900'
                        }`}
                      >
                        {purchasedItems.includes(selectedItem.id) ? (
                          <>
                            <Check className="h-5 w-5 mr-2" /> ACQUIRED
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5 mr-2" /> PURCHASE • {selectedItem.price} GOLD
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Store;
