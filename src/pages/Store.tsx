import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Coins, ShoppingCart, Check, X } from "lucide-react";
import holyportion from "public/holyportion.png";


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
  /* latin */
  @font-face {
    font-family: 'Orbitron';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyKS6BoWgz.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
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
      imagePath: "/images/potion-strength.png",
      itemClass: "A",
    },
    {
      id: "p2",
      name: "Elixir of Intelligence",
      description: "Sharpen your mind with +5 intelligence.",
      price: 150,
      type: "potion",
      effect: "intelligence",
      imagePath: "/images/potion-intelligence.png",
      itemClass: "A",
    },
    {
      id: "p3",
      name: "Agility Brew",
      description: "Increases dexterity by +5 for nimble moves.",
      price: 150,
      type: "potion",
      effect: "dexterity",
      imagePath: "/images/potion-dexterity.png",
      itemClass: "A",
    },
    {
      id: "e1",
      name: "Hunter's Blade",
      description: "A sharp blade forged for elite hunters.",
      price: 300,
      type: "equipment",
      effect: "strength",
      imagePath: "/images/hunter-blade.png",
      itemClass: "S",
    },
    {
      id: "s1",
      name: "Mind Surge",
      description: "Gain 500 XP instantly.",
      price: 250,
      type: "skill",
      effect: "xp",
      imagePath: "/images/mind-surge.png",
      itemClass: "B",
    },
    {
      id: "e2",
      name: "Shadow Cloak",
      description: "A cloak that enhances your agility.",
      price: 300,
      type: "equipment",
      effect: "dexterity",
      imagePath: "/images/shadow-cloak.png",
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

  // Define a consumable type map
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
      {/* Add style tag to include the Orbitron font */}
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
                {/* Item card matching the reference image exactly */}
                <div className="bg-gray-900 border border-amber-500/30 rounded hover:bg-gray-800 transition-all duration-200">
                  <div className="flex items-center p-4 gap-4">
                    {/* Image container with golden border - exact match to reference */}
                    <div className="w-16 h-16 border border-amber-500 flex items-center justify-center bg-gray-800">
                      <img src={item.imagePath} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    
                    {/* Item info - styled to match reference image with Orbitron font */}
                    <div className="flex-1">
                      <h3 className="text-amber-400 font-bold text-x1 tracking-wide">{item.name}</h3>
                      <p className="text-amber-300/90 text-sm">Class: {item.itemClass}</p>
                    </div>
                    
                    {/* Price - styled to match reference image */}
                    <div className="flex items-center text-amber-400 font-medium">
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
              <div className="relative w-full bg-gray-900 border-2 border-amber-500/50 overflow-hidden">
                {/* Diagonal pattern background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: "linear-gradient(45deg, #fcd34d 25%, transparent 25%, transparent 50%, #fcd34d 50%, #fcd34d 75%, transparent 75%, transparent)",
                    backgroundSize: "8px 8px"
                  }}></div>
                </div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-amber-500/30">
                    <h2 className="text-xl font-bold text-amber-400">ITEM</h2>
                    <button 
                      className="text-amber-400 hover:text-amber-300"
                      onClick={() => setSelectedItem(null)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Item details */}
                  <div className="p-6">
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        {/* Item image on left */}
                        <div className="w-32 h-32 border-2 border-amber-500/50 bg-black/30 flex items-center justify-center mr-6">
                          <img src={selectedItem.imagePath} alt={selectedItem.name} className="w-24 h-24 object-contain" />
                        </div>
                        
                        {/* Item info on right */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-amber-400 uppercase tracking-wide">[{selectedItem.name}]</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-amber-400 font-medium">ITEM CLASS: {selectedItem.itemClass || "C"}</p>
                            <p className="text-amber-400 font-medium">TYPE: {getItemTypeName(selectedItem.type)}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description below the image */}
                      <div className="mt-8">
                        <p className="text-amber-400 uppercase leading-relaxed font-medium tracking-wide">
                          {selectedItem.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Purchase button */}
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
                            : 'bg-amber-500 hover:bg-amber-400 text-gray-900'
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