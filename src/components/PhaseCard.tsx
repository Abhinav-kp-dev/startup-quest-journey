import { CheckCircle, Lock, Play, Star } from "lucide-react";

interface PhaseCardProps {
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  progress: number;
  xpReward: number;
  onComplete: () => void;
}

const PhaseCard = ({ title, description, status, progress, xpReward, onComplete }: PhaseCardProps) => {
  const getCardClass = () => {
    switch (status) {
      case 'locked':
        return 'phase-card-locked';
      case 'completed':
        return 'phase-card-completed';
      default:
        return 'phase-card-unlocked';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'locked':
        return <Lock size={24} className="text-muted-foreground" />;
      case 'completed':
        return <CheckCircle size={24} className="text-secondary" />;
      default:
        return <Play size={24} className="text-primary" />;
    }
  };

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 cursor-pointer ${getCardClass()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-accent">
          <Star size={16} />
          <span className="text-sm font-semibold">{xpReward} XP</span>
        </div>
      </div>

      {status !== 'locked' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-semibold">{progress}%</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {status === 'unlocked' && progress < 100 && (
            <button 
              onClick={onComplete}
              className="btn-complete w-full mt-4"
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhaseCard;