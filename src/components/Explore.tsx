import { useState } from "react";
import { Search, ThumbsUp, Users, Plus, Filter, TrendingUp, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GuildManager from "./GuildManager";
import UserChat from "./UserChat";
import useUserData, { User } from "@/hooks/useUserData";

interface Idea {
  id: string;
  title: string;
  summary: string;
  author: string;
  category: string;
  upvotes: number;
  views: number;
  trending: boolean;
  hasUpvoted: boolean;
}


interface ExploreProps {
  onUpvote: (ideaId: string) => void;
}

const Explore = ({ onUpvote }: ExploreProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [showGuildManager, setShowGuildManager] = useState(false);
  const [showUserChat, setShowUserChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { users } = useUserData();

  const categories = ['all', 'tech', 'environment', 'health', 'fintech', 'education'];

  const [ideas] = useState<Idea[]>([
    {
      id: '1',
      title: 'AI-Powered Sustainable Energy Optimizer',
      summary: 'Using machine learning to optimize renewable energy consumption in smart homes',
      author: 'EcoTechFounder',
      category: 'environment',
      upvotes: 42,
      views: 234,
      trending: true,
      hasUpvoted: false
    },
    {
      id: '2',
      title: 'Mental Health Companion App',
      summary: 'A mobile app that provides personalized mental health support using CBT techniques',
      author: 'WellnessBuilder',
      category: 'health',
      upvotes: 38,
      views: 189,
      trending: true,
      hasUpvoted: false
    },
    {
      id: '3',
      title: 'Blockchain-Based Learning Credits',
      summary: 'Decentralized platform for verifying and transferring educational achievements',
      author: 'EduChainVision',
      category: 'education',
      upvotes: 29,
      views: 156,
      trending: false,
      hasUpvoted: true
    }
  ]);


  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpvote = (ideaId: string) => {
    onUpvote(ideaId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explore Ideas</h1>
          <p className="text-muted-foreground">Discover, share, and collaborate on startup ideas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewIdeaModal(true)} className="btn-quest">
            <Plus size={20} />
            Share Idea
          </Button>
          <Button onClick={() => setShowGuildManager(true)} variant="outline">
            <Users size={20} />
            Manage Guilds
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <div key={idea.id} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  {idea.category}
                </span>
                {idea.trending && (
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium flex items-center gap-1">
                    <TrendingUp size={12} />
                    Trending
                  </span>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-2">{idea.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{idea.summary}</p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <button
                onClick={() => {
                  const user = users.find(u => u.username === idea.author);
                  if (user) {
                    setSelectedUser(user);
                    setShowUserChat(true);
                  }
                }}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <MessageCircle size={14} />
                by {idea.author}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  {idea.views}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleUpvote(idea.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
                  idea.hasUpvoted 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <ThumbsUp size={16} />
                {idea.upvotes}
              </button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* New Idea Modal */}
      {showNewIdeaModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
            <h3 className="text-xl font-bold mb-4">Share Your Idea</h3>
            <p className="text-muted-foreground mb-4">Coming soon! You'll be able to share your startup ideas here.</p>
            <Button onClick={() => setShowNewIdeaModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Components */}
      <GuildManager
        isOpen={showGuildManager}
        onClose={() => setShowGuildManager(false)}
      />
      
      {selectedUser && (
        <UserChat
          targetUser={selectedUser}
          onClose={() => {
            setShowUserChat(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Explore;