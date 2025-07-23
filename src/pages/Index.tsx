import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import PhaseContent from "@/components/PhaseContent";
import Profile from "@/components/Profile";
import Chatbot from "@/components/Chatbot";
import Explore from "@/components/Explore";

interface Phase {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  progress: number;
  xpReward: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

const Index = () => {
  // Core state management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(150);
  const [maxXP, setMaxXP] = useState(1000);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Initialize phases
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 'validation',
      title: 'Idea Validation',
      description: 'Validate your startup idea with real customers',
      status: 'unlocked',
      progress: 60,
      xpReward: 200
    },
    {
      id: 'mvp',
      title: 'Build MVP',
      description: 'Create your minimum viable product',
      status: 'locked',
      progress: 0,
      xpReward: 300
    },
    {
      id: 'launch',
      title: 'Product Launch',
      description: 'Launch your product to the market',
      status: 'locked',
      progress: 0,
      xpReward: 400
    },
    {
      id: 'monetization',
      title: 'Monetization',
      description: 'Implement revenue streams',
      status: 'locked',
      progress: 0,
      xpReward: 350
    },
    {
      id: 'feedback',
      title: 'Feedback & Iterate',
      description: 'Collect feedback and improve',
      status: 'locked',
      progress: 0,
      xpReward: 250
    },
    {
      id: 'scale',
      title: 'Pitch & Scale',
      description: 'Scale your business and get funding',
      status: 'locked',
      progress: 0,
      xpReward: 500
    }
  ]);

  // Initialize badges
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first phase',
      earned: false
    },
    {
      id: 'validator',
      name: 'Idea Validator',
      description: 'Complete the validation phase',
      earned: false
    },
    {
      id: 'builder',
      name: 'MVP Builder',
      description: 'Successfully build and launch your MVP',
      earned: false
    },
    {
      id: 'entrepreneur',
      name: 'True Entrepreneur',
      description: 'Complete all startup phases',
      earned: false
    },
    {
      id: 'community-member',
      name: 'Community Member',
      description: 'Share 5 ideas in the community',
      earned: false
    },
    {
      id: 'supporter',
      name: 'Supportive Member',
      description: 'Give 10 upvotes to community ideas',
      earned: false
    }
  ]);

  // User profile stats
  const [userStats, setUserStats] = useState({
    username: 'StartupFounder',
    ideasShared: 2,
    upvotesGiven: 7,
    completedPhases: [] as string[]
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('startupQuestData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserLevel(parsed.userLevel || 1);
        setUserXP(parsed.userXP || 150);
        setMaxXP(parsed.maxXP || 1000);
        setPhases(parsed.phases || phases);
        setBadges(parsed.badges || badges);
        setUserStats(parsed.userStats || userStats);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    const dataToSave = {
      userLevel,
      userXP,
      maxXP,
      phases,
      badges,
      userStats
    };
    localStorage.setItem('startupQuestData', JSON.stringify(dataToSave));
  }, [userLevel, userXP, maxXP, phases, badges, userStats]);

  // Handle phase completion
  const handlePhaseComplete = (phaseId: string) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        // Complete current phase
        const updatedPhase = { ...phase, status: 'completed' as const, progress: 100 };
        
        // Add XP
        setUserXP(prevXP => {
          const newXP = prevXP + phase.xpReward;
          
          // Check for level up
          if (newXP >= maxXP) {
            setUserLevel(prevLevel => prevLevel + 1);
            setMaxXP(prevMax => prevMax + 200); // Increase XP requirement
            setUserXP(newXP - maxXP); // Carry over excess XP
          }
          
          return newXP >= maxXP ? newXP - maxXP : newXP;
        });

        // Update completed phases
        setUserStats(prev => ({
          ...prev,
          completedPhases: [...prev.completedPhases.filter(id => id !== phaseId), phase.title]
        }));

        // Award badges
        setBadges(prevBadges => prevBadges.map(badge => {
          if (badge.id === 'first-steps' && userStats.completedPhases.length === 0) {
            return { ...badge, earned: true };
          }
          if (badge.id === 'validator' && phaseId === 'validation') {
            return { ...badge, earned: true };
          }
          if (badge.id === 'builder' && phaseId === 'mvp') {
            return { ...badge, earned: true };
          }
          return badge;
        }));

        return updatedPhase;
      }
      
      // Unlock next phase if it was locked
      const currentIndex = prev.findIndex(p => p.id === phaseId);
      const thisIndex = prev.findIndex(p => p.id === phase.id);
      
      if (thisIndex === currentIndex + 1 && phase.status === 'locked') {
        return { ...phase, status: 'unlocked' as const };
      }
      
      return phase;
    }));
  };

  // Handle idea upvoting
  const handleUpvote = (ideaId: string) => {
    setUserStats(prev => {
      const newUpvotesGiven = prev.upvotesGiven + 1;
      
      // Award supporter badge
      if (newUpvotesGiven >= 10) {
        setBadges(prevBadges => prevBadges.map(badge => 
          badge.id === 'supporter' ? { ...badge, earned: true } : badge
        ));
      }
      
      return { ...prev, upvotesGiven: newUpvotesGiven };
    });
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            userLevel={userLevel}
            userXP={userXP}
            maxXP={maxXP}
            phases={phases}
            onPhaseComplete={handlePhaseComplete}
          />
        );
      case 'validation':
      case 'mvp':
      case 'launch':
      case 'monetization':
      case 'feedback':
      case 'scale':
        return <PhaseContent phase={activeTab} />;
      case 'profile':
        return (
          <Profile
            username={userStats.username}
            level={userLevel}
            xp={userXP}
            badges={badges}
            completedPhases={userStats.completedPhases}
            ideasShared={userStats.ideasShared}
            upvotesGiven={userStats.upvotesGiven}
          />
        );
      case 'chatbot':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Startup Mentor Chatbot</h1>
            <p className="text-muted-foreground mb-8">Click the floating chat button to start a conversation with your AI mentor!</p>
            <div className="bg-card rounded-xl p-8 border border-border">
              <p className="text-lg">The chatbot is available in the bottom-right corner of your screen.</p>
            </div>
          </div>
        );
      case 'explore':
        return <Explore onUpvote={handleUpvote} />;
      default:
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
            <p className="text-muted-foreground">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pb-24">
        {renderTabContent()}
      </main>

      <Chatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  );
};

export default Index;
