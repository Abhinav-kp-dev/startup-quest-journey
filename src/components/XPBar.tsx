import { Trophy, Star } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

const XPBar = ({ currentXP, maxXP, level }: XPBarProps) => {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent text-accent-foreground p-2 rounded-lg badge-glow">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Level {level}</h2>
            <p className="text-muted-foreground">Startup Entrepreneur</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-accent">
          <Star size={20} />
          <span className="font-semibold">{currentXP}/{maxXP} XP</span>
        </div>
      </div>
      
      <div className="xp-bar">
        <div 
          className="xp-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground text-right">
        {maxXP - currentXP} XP until Level {level + 1}
      </div>
    </div>
  );
};

export default XPBar;