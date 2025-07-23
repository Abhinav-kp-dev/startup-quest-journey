import { useState } from 'react';
import { Users, Crown, Shield, User, Clock, Check, X, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useUserData, { Guild, GuildRequest } from '@/hooks/useUserData';
import GuildChat from './GuildChat';

interface GuildManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuildManager = ({ isOpen, onClose }: GuildManagerProps) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-guilds' | 'requests'>('browse');
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [targetGuildId, setTargetGuildId] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatGuildId, setChatGuildId] = useState('');

  const {
    currentUserId,
    guilds,
    guildRequests,
    joinGuild,
    handleGuildRequest,
    isUserInGuild,
    getUserGuilds,
    getPendingRequests
  } = useUserData();

  const handleJoinGuild = (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId);
    if (guild?.isPrivate) {
      setTargetGuildId(guildId);
      setShowJoinModal(true);
    } else {
      joinGuild(guildId);
    }
  };

  const submitJoinRequest = () => {
    joinGuild(targetGuildId, joinMessage);
    setShowJoinModal(false);
    setJoinMessage('');
    setTargetGuildId('');
  };

  const openGuildChat = (guildId: string) => {
    setChatGuildId(guildId);
    setShowChat(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown size={16} className="text-accent" />;
      case 'admin': return <Shield size={16} className="text-secondary" />;
      default: return <User size={16} className="text-muted-foreground" />;
    }
  };

  const myGuilds = getUserGuilds();
  const pendingRequests = getPendingRequests();

  if (!isOpen) return null;

  if (showChat && chatGuildId) {
    return (
      <GuildChat
        guildId={chatGuildId}
        onClose={() => setShowChat(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-primary" />
              Guild Manager
            </h2>
            <Button variant="ghost" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === 'browse' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('browse')}
              size="sm"
            >
              Browse Guilds
            </Button>
            <Button
              variant={activeTab === 'my-guilds' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('my-guilds')}
              size="sm"
            >
              My Guilds ({myGuilds.length})
            </Button>
            <Button
              variant={activeTab === 'requests' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('requests')}
              size="sm"
            >
              Requests ({pendingRequests.length})
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {guilds.map((guild) => (
                <div key={guild.id} className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{guild.name}</h3>
                        {guild.isPrivate && (
                          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                            Private
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{guild.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{guild.members.length} members</span>
                        <span>Category: {guild.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isUserInGuild(guild.id) ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openGuildChat(guild.id)}
                          >
                            <MessageSquare size={16} className="mr-1" />
                            Chat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedGuild(guild)}
                          >
                            <Settings size={16} className="mr-1" />
                            View
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleJoinGuild(guild.id)}
                          size="sm"
                        >
                          Join Guild
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'my-guilds' && (
            <div className="space-y-4">
              {myGuilds.map((guild) => (
                <div key={guild.id} className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{guild.name}</h3>
                      <p className="text-muted-foreground">{guild.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGuildChat(guild.id)}
                      >
                        <MessageSquare size={16} className="mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Members:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {guild.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 p-2 bg-background rounded-lg">
                          <span className="text-lg">{member.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.username}</span>
                              {getRoleIcon(member.role)}
                            </div>
                            <span className="text-xs text-muted-foreground">Level {member.level}</span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold">{request.username}</h3>
                        <span className="text-sm text-muted-foreground">
                          wants to join {guilds.find(g => g.id === request.guildId)?.name}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{request.message}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        {request.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGuildRequest(request.id, 'reject')}
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGuildRequest(request.id, 'accept')}
                      >
                        <Check size={16} className="mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pending requests
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Join Request Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Request to Join Guild</h3>
            <p className="text-muted-foreground mb-4">
              This is a private guild. Please write a message explaining why you'd like to join.
            </p>
            <Textarea
              placeholder="Tell them about your experience and why you want to join..."
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitJoinRequest}
                disabled={!joinMessage.trim()}
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuildManager;