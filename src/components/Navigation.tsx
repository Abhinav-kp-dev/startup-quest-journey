import { Home, Target, Rocket, DollarSign, MessageSquare, User, Compass, Bot, TrendingUp, Users } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'validation', label: 'Validation', icon: Target },
    { id: 'mvp', label: 'MVP', icon: Rocket },
    { id: 'launch', label: 'Launch', icon: TrendingUp },
    { id: 'monetization', label: 'Monetization', icon: DollarSign },
    { id: 'feedback', label: 'Feedback & Iterate', icon: MessageSquare },
    { id: 'scale', label: 'Pitch & Scale', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'explore', label: 'Explore', icon: Compass },
  ];

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-tab flex items-center gap-2 ${
                isActive ? 'nav-tab-active' : 'nav-tab-inactive'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;