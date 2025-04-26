import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  id: string;
  username: string;
  email: string;
  gold?: number;
  profileImage?: string; // Added profile image
  stats: {
    level: number;
    rank: string;
    strength: number;
    intelligence: number;
    dexterity: number;
    currentXP: number;
    maxXP: number;
  };
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, characterClass: string) => Promise<void>;
  logout: () => void;
  updateUserStats: (xpAmount: number, additionalStats?: Record<string, any>) => void;
  updateUserProfile: (username: string, email: string) => void;
  updateProfileImage: (image: File) => void; // Added method for updating profile image
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("soloLevelingUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const generateUserStats = (characterClass: string) => {
    // Different starting stats based on character class
    if (characterClass === "Rookie Hunter") {
      return {
        level: 1,
        rank: "E-RANK",
        strength: 8,
        intelligence: 10,
        dexterity: 8,
        currentXP: 0,
        maxXP: 800,
      };
    } else if (characterClass === "Mage Hunter") {
      return {
        level: 1,
        rank: "E-RANK",
        strength: 6,
        intelligence: 14,
        dexterity: 6,
        currentXP: 0,
        maxXP: 800,
      };
    } else {
      // Default/Assassin
      return {
        level: 1,
        rank: "E-RANK",
        strength: 7,
        intelligence: 7,
        dexterity: 12,
        currentXP: 0,
        maxXP: 800,
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const storedUsers = localStorage.getItem("soloLevelingUsers");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remove password before storing in state
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem("soloLevelingUser", JSON.stringify(userWithoutPassword));
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed: Invalid email or password");
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, characterClass: string) => {
    try {
      const storedUsers = localStorage.getItem("soloLevelingUsers");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userExists = users.some((u: any) => u.email === email);
      
      if (userExists) {
        throw new Error("User already exists with this email");
      }
      
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        gold: 500, // Starting gold
        stats: generateUserStats(characterClass),
        quests: [],
        habits: [],
        shadowSoldiers: []
      };
      
      users.push(newUser);
      localStorage.setItem("soloLevelingUsers", JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("soloLevelingUser", JSON.stringify(userWithoutPassword));
      
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(`Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("soloLevelingUser");
    navigate("/login");
    toast.success("Logged out successfully");
  };
  
  const updateUserStats = (xpAmount: number, additionalStats?: Record<string, any>) => {
    if (!isAuthenticated || !user) return;
    
    const storedUsers = localStorage.getItem("soloLevelingUsers");
    if (!storedUsers) return;
    
    const users = JSON.parse(storedUsers);
    const currentUserIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (currentUserIndex >= 0) {
      let { currentXP, maxXP, level, rank } = users[currentUserIndex].stats;
      
      // Add XP if provided
      if (xpAmount > 0) {
        currentXP += xpAmount;
        
        // Level up logic
        if (currentXP >= maxXP) {
          level += 1;
          currentXP = currentXP - maxXP;
          maxXP = Math.floor(maxXP * 1.2); // Increase XP needed for next level
          
          if (level >= 20) rank = "S-RANK";
          else if (level >= 15) rank = "A-RANK";
          else if (level >= 10) rank = "B-RANK";
          else if (level >= 5) rank = "C-RANK";
          else if (level >= 3) rank = "D-RANK";
          
          toast.success(`LEVEL UP! You are now level ${level}!`);
          if (rank !== users[currentUserIndex].stats.rank) {
            toast.success(`RANK UP! You are now ${rank}!`);
          }
        }
      }
      
      // Update user stats
      users[currentUserIndex].stats = {
        ...users[currentUserIndex].stats,
        currentXP,
        maxXP,
        level,
        rank,
        ...(additionalStats && additionalStats.strength && { strength: additionalStats.strength }),
        ...(additionalStats && additionalStats.intelligence && { intelligence: additionalStats.intelligence }),
        ...(additionalStats && additionalStats.dexterity && { dexterity: additionalStats.dexterity })
      };
      
      // Update gold if changed
      if (additionalStats?.gold !== undefined) {
        users[currentUserIndex].gold = additionalStats.gold;
      }
      
      // Save to localStorage
      localStorage.setItem("soloLevelingUsers", JSON.stringify(users));
      
      // Also update the current user in session
      const { password, ...userWithoutPassword } = users[currentUserIndex];
      setUser(userWithoutPassword);
      localStorage.setItem("soloLevelingUser", JSON.stringify(userWithoutPassword));
    }
  };
  
  const updateUserProfile = (username: string, email: string) => {
    if (!isAuthenticated || !user) return;
    
    const storedUsers = localStorage.getItem("soloLevelingUsers");
    if (!storedUsers) return;
    
    const users = JSON.parse(storedUsers);
    const currentUserIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (currentUserIndex >= 0) {
      users[currentUserIndex].username = username;
      users[currentUserIndex].email = email;
      
      // Save to localStorage
      localStorage.setItem("soloLevelingUsers", JSON.stringify(users));
      
      // Also update the current user in session
      const { password, ...userWithoutPassword } = users[currentUserIndex];
      setUser(userWithoutPassword);
      localStorage.setItem("soloLevelingUser", JSON.stringify(userWithoutPassword));
    }
  };

  const updateProfileImage = (image: File) => {
    if (!isAuthenticated || !user) return;

    const reader = new FileReader();
    
    reader.onloadend = () => {
      const profileImage = reader.result as string;
      
      const storedUsers = localStorage.getItem("soloLevelingUsers");
      if (!storedUsers) return;

      const users = JSON.parse(storedUsers);
      const currentUserIndex = users.findIndex((u: any) => u.id === user.id);

      if (currentUserIndex >= 0) {
        users[currentUserIndex].profileImage = profileImage;

        localStorage.setItem("soloLevelingUsers", JSON.stringify(users));
        
        const { password, ...userWithoutPassword } = users[currentUserIndex];
        setUser(userWithoutPassword);
        localStorage.setItem("soloLevelingUser", JSON.stringify(userWithoutPassword));
        
        toast.success("Profile image updated successfully!");
      }
    };
    
    reader.readAsDataURL(image);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateUserStats,
      updateUserProfile,
      updateProfileImage,  // Include here
    }}>
      {children}
    </AuthContext.Provider>
  );
};
