import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Users, Crown, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUserData from '@/hooks/useUserData';

interface GuildChatProps {
  guildId: string;
  onClose: () => void;
}

const GuildChat = ({ guildId, onClose }: GuildChatProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentUserId,
    guilds,
    guildMessages,
    sendGuildMessage
  } = useUserData();

  const guild = guilds.find(g => g.id === guildId);
  const messages = guildMessages.filter(m => m.guildId === guildId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendGuildMessage(guildId, message);
    setMessage('');
  };

  const getRoleIcon = (userId: string) => {
    const member = guild?.members.find(m => m.id === userId);
    switch (member?.role) {
      case 'owner': return <Crown size={12} className="text-accent" />;
      case 'admin': return <Shield size={12} className="text-secondary" />;
      default: return <User size={12} className="text-muted-foreground" />;
    }
  };

  const getMemberAvatar = (userId: string) => {
    const member = guild?.members.find(m => m.id === userId);
    return member?.avatar || '👤';
  };

  if (!guild) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h2 className="text-xl font-bold">{guild.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users size={12} />
                  {guild.members.length} members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.userId === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
                  {getMemberAvatar(msg.userId)}
                </div>
              </div>
              <div className={`flex-1 max-w-[70%] ${msg.userId === currentUserId ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{msg.username}</span>
                  {getRoleIcon(msg.userId)}
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div 
                  className={`p-3 rounded-2xl ${
                    msg.userId === currentUserId 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted/50 text-foreground rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Welcome to {guild.name}!</p>
              <p className="text-sm">Start the conversation by sending a message.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-gradient-to-r from-background/95 to-muted/95 rounded-b-2xl">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message ${guild.name}...`}
                className="w-full px-4 py-3 bg-muted/50 rounded-2xl text-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              disabled={!message.trim()}
              className="w-10 h-10 rounded-xl p-0 hover-scale"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildChat;