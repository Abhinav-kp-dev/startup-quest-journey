import { useState, useEffect } from "react";
import XPBar from "./XPBar";
import PhaseCard from "./PhaseCard";
import { Sparkles, Target, Zap } from "lucide-react";

interface Phase {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  progress: number;
  xpReward: number;
}

interface DashboardProps {
  userLevel: number;
  userXP: number;
  maxXP: number;
  phases: Phase[];
  onPhaseComplete: (phaseId: string) => void;
}

const Dashboard = ({ userLevel, userXP, maxXP, phases, onPhaseComplete }: DashboardProps) => {
  const [celebratePhase, setCelebratePhase] = useState<string | null>(null);

  const handlePhaseComplete = (phaseId: string) => {
    onPhaseComplete(phaseId);
    setCelebratePhase(phaseId);
    setTimeout(() => setCelebratePhase(null), 3000);
  };

  const completedCount = phases.filter(p => p.status === 'completed').length;
  const unlockedCount = phases.filter(p => p.status === 'unlocked').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Celebration Animation */}
      {celebratePhase && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-primary text-primary-foreground px-8 py-4 rounded-xl shadow-2xl animate-pulse-glow">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="animate-pulse" />
              Phase Completed! +{phases.find(p => p.id === celebratePhase)?.xpReward} XP
              <Sparkles className="animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* XP Bar */}
      <XPBar currentXP={userXP} maxXP={maxXP} level={userLevel} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-secondary" />
          <h3 className="text-2xl font-bold">{completedCount}</h3>
          <p className="text-muted-foreground">Phases Completed</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 text-warning" />
          <h3 className="text-2xl font-bold">{unlockedCount}</h3>
          <p className="text-muted-foreground">Active Phases</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-accent" />
          <h3 className="text-2xl font-bold">{userXP}</h3>
          <p className="text-muted-foreground">Total XP</p>
        </div>
      </div>

      {/* Startup Journey Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Your Startup Journey</h1>
        <p className="text-muted-foreground text-lg">Complete phases to unlock new challenges and earn XP</p>
      </div>

      {/* Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            title={phase.title}
            description={phase.description}
            status={phase.status}
            progress={phase.progress}
            xpReward={phase.xpReward}
            onComplete={() => handlePhaseComplete(phase.id)}
          />
        ))}
      </div>

      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center border border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h2>
        <p className="text-muted-foreground mb-6">
          Every successful startup begins with a single step. Choose your next phase and continue your entrepreneurial journey.
        </p>
        <div className="flex justify-center gap-4">
          <button className="btn-quest">
            Start Next Phase
          </button>
          <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-200">
            View All Phases
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;