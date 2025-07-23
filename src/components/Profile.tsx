import { User, Award, Trophy, Target, TrendingUp } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface ProfileProps {
  username: string;
  level: number;
  xp: number;
  badges: Badge[];
  completedPhases: string[];
  ideasShared: number;
  upvotesGiven: number;
}

const Profile = ({ username, level, xp, badges, completedPhases, ideasShared, upvotesGiven }: ProfileProps) => {
  const earnedBadges = badges.filter(badge => badge.earned);
  
  // RPG Character Avatar based on level
  const getCharacterAvatar = (level: number) => {
    if (level >= 10) {
      return (
        <div className="w-32 h-32 bg-gradient-to-b from-accent to-accent/70 rounded-lg border-4 border-accent/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent"></div>
          <div className="text-6xl">🧙‍♂️</div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full border-2 border-primary-foreground flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">★</span>
          </div>
        </div>
      );
    } else if (level >= 5) {
      return (
        <div className="w-32 h-32 bg-gradient-to-b from-secondary to-secondary/70 rounded-lg border-4 border-secondary/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent"></div>
          <div className="text-6xl">🏗️</div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full border-2 border-secondary-foreground flex items-center justify-center">
            <span className="text-xs font-bold text-secondary-foreground">⚡</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-32 h-32 bg-gradient-to-b from-primary to-primary/70 rounded-lg border-4 border-primary/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
          <div className="text-6xl">🚀</div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-muted rounded-full border-2 border-muted-foreground flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">🌟</span>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-card rounded-xl p-8 border border-border">
        {/* RPG Character Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            {getCharacterAvatar(level)}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{username}</h1>
            <p className="text-xl text-muted-foreground mb-1">Level {level} Entrepreneur</p>
            <p className="text-sm text-muted-foreground">{xp} Total XP Earned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted rounded-lg p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{completedPhases.length}</p>
            <p className="text-sm text-muted-foreground">Phases Completed</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold">{ideasShared}</p>
            <p className="text-sm text-muted-foreground">Ideas Shared</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">{upvotesGiven}</p>
            <p className="text-sm text-muted-foreground">Upvotes Given</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="text-accent" />
          Badges Earned ({earnedBadges.length}/{badges.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-4 rounded-lg border transition-all duration-300 ${
                badge.earned 
                  ? 'bg-accent/10 border-accent badge-glow' 
                  : 'bg-muted border-border opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Award className={badge.earned ? 'text-accent' : 'text-muted-foreground'} size={20} />
                <h3 className="font-semibold">{badge.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-2xl font-bold mb-4">Completed Phases</h2>
        <div className="space-y-2">
          {completedPhases.length > 0 ? (
            completedPhases.map((phase, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-secondary/10 rounded-lg">
                <Target className="text-secondary" size={16} />
                <span className="font-medium">{phase}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No phases completed yet. Start your journey!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;