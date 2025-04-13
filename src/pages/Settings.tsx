
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Bell, Moon, Sun, Volume2, VolumeX } from "lucide-react";

const Settings = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    sound: true,
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    updateUserProfile(profile.username, profile.email);
    toast.success("Profile updated successfully");
  };
  
  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
    
    toast.success(`${setting} ${settings[setting] ? "disabled" : "enabled"}`);
  };
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-solo-bg">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-4xl font-bold mb-8 solo-glow-text">
            SETTINGS
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <div className="solo-card">
              <h2 className="text-xl font-bold mb-6 solo-glow-text flex items-center">
                <User className="h-5 w-5 mr-2" /> Profile Settings
              </h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm">Username</label>
                  <Input
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="solo-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="solo-input"
                  />
                </div>
                
                <Button type="submit" className="solo-button">
                  Update Profile
                </Button>
              </form>
            </div>
            
            {/* App Settings */}
            <div className="solo-card">
              <h2 className="text-xl font-bold mb-6 solo-glow-text">
                App Settings
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {settings.darkMode ? (
                      <Moon className="h-5 w-5 text-solo-blue" />
                    ) : (
                      <Sun className="h-5 w-5 text-amber-400" />
                    )}
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={() => toggleSetting("darkMode")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-solo-purple" />
                    <Label htmlFor="notifications">Notifications</Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={() => toggleSetting("notifications")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {settings.sound ? (
                      <Volume2 className="h-5 w-5 text-solo-cyan" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-500" />
                    )}
                    <Label htmlFor="sound">Sound Effects</Label>
                  </div>
                  <Switch
                    id="sound"
                    checked={settings.sound}
                    onCheckedChange={() => toggleSetting("sound")}
                  />
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="solo-card border border-red-500/30 lg:col-span-2">
              <h2 className="text-xl font-bold mb-6 text-red-400">
                Danger Zone
              </h2>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <p className="text-slate-400">
                    Logging out will end your current session. You'll need to log in again to access your account.
                  </p>
                </div>
                
                <Button 
                  variant="destructive"
                  className="sm:w-auto"
                  onClick={logout}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
