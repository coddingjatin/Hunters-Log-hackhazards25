
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  Store, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div 
      className={cn(
        "bg-black/40 backdrop-blur-md border-r border-solo-blue/20 h-screen transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-solo-blue/20">
        {!collapsed && (
          <h2 className="text-xl font-bold solo-glow-text">
            HUNTER'S LOG
          </h2>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-solo-blue/20 transition-colors"
        >
          {collapsed ? (
            <Menu size={20} className="text-solo-blue" />
          ) : (
            <X size={20} className="text-solo-blue" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            to="/dashboard"
            collapsed={collapsed}
            active={location.pathname === "/dashboard"}
          />
          <SidebarItem 
            icon={<Store className="h-5 w-5" />} 
            label="Store" 
            to="/store"
            collapsed={collapsed}
            active={location.pathname === "/store"}
          />
          <SidebarItem 
            icon={<Users className="h-5 w-5" />} 
            label="Shadow Soldiers" 
            to="/shadow-soldiers"
            collapsed={collapsed}
            active={location.pathname === "/shadow-soldiers"}
          />
          <SidebarItem 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            to="/settings"
            collapsed={collapsed}
            active={location.pathname === "/settings"}
          />
        </ul>
      </nav>
      
      <div className="p-4 border-t border-solo-blue/20">
        <button 
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-solo-blue/20 text-red-400 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
  active: boolean;
}

const SidebarItem = ({ icon, label, to, collapsed, active }: SidebarItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3 transition-colors",
          active ? "text-solo-blue bg-solo-blue/10" : "text-white/80 hover:text-solo-blue hover:bg-solo-blue/10", 
          collapsed ? "justify-center" : "px-6"
        )}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  );
};

export default Sidebar;
