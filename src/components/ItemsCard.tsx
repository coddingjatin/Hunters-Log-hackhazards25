
import React from "react";

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  imagePath: string;
}

const items: Item[] = [
  {
    id: "1",
    name: "Elixir of Life",
    price: 150,
    description: "Increases health regeneration",
    imagePath: "/assets/potion-red.png",
  },
  {
    id: "2",
    name: "XP Boost",
    price: 200,
    description: "Doubles XP gained for 24 hours",
    imagePath: "/assets/potion-blue.png",
  },
];

const ItemsCard = () => {
  return (
    <div className="solo-card w-full">
      <h2 className="text-xl font-bold mb-4 solo-glow-text">Properties</h2>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center p-3 border border-solo-blue/30 bg-black/40 rounded-md">
            <div className="w-12 h-12 bg-solo-blue/20 rounded-md flex items-center justify-center mr-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solo-blue/60 to-solo-magenta/30 animate-pulse-glow" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">{item.name}</h3>
              <div className="flex items-center mt-1">
                <span className="flex items-center text-amber-300 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path d="M12 6a6 6 0 0 1 6 6v1h4v2l-4 1.5v.5c0 1.1-.9 2-2 2a1 1 0 0 1-1-1v-.5l-3-1.5-3 1.5V18a1 1 0 0 1-1 1c-1.1 0-2-.9-2-2v-.5L2 15v-2h4v-1a6 6 0 0 1 6-6ZM6 15H4v.33l2 .67v-1Zm14 0h-2v1l2-.67V15ZM12 8a4 4 0 0 0-4 4v1h8v-1a4 4 0 0 0-4-4Z" />
                  </svg>
                  {item.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsCard;
