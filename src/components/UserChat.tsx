import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUserData, { User } from '@/hooks/useUserData';

interface UserChatProps {
  targetUser: User;
  onClose: () => void;
}

const UserChat = ({ targetUser, onClose }: UserChatProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentUserId,
    users,
    directMessages,
    sendDirectMessage
  } = useUserData();

  const currentUser = users.find(u => u.id === currentUserId);
  const conversation = directMessages.filter(m => 
    (m.fromUserId === currentUserId && m.toUserId === targetUser.id) ||
    (m.fromUserId === targetUser.id && m.toUserId === currentUserId)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendDirectMessage(targetUser.id, message);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl h-[70vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft size={18} />
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg">
                    {targetUser.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    targetUser.isOnline ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{targetUser.username}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Circle size={8} className={targetUser.isOnline ? 'text-green-500 fill-green-500' : 'text-gray-500 fill-gray-500'} />
                    {targetUser.isOnline ? 'Online' : 'Offline'} • Level {targetUser.level}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.fromUserId === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
                  {msg.fromUserId === currentUserId ? currentUser?.avatar : targetUser.avatar}
                </div>
              </div>
              <div className={`flex-1 max-w-[70%] ${msg.fromUserId === currentUserId ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {msg.fromUserId === currentUserId ? currentUser?.username : targetUser.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div 
                  className={`p-3 rounded-2xl ${
                    msg.fromUserId === currentUserId 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted/50 text-foreground rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
          {conversation.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl mx-auto mb-4">
                {targetUser.avatar}
              </div>
              <p>Start a conversation with {targetUser.username}!</p>
              <p className="text-sm">Send a message to get started.</p>
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
                placeholder={`Message ${targetUser.username}...`}
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

export default UserChat;