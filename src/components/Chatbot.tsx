import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot = ({ isOpen, onToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hello! I'm your AI Startup Mentor. I can help you with validation, MVP development, fundraising, and more. What challenge are you facing today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = [
    "🎯 For validation, start with the 'Mom Test' - ask about problems, not solutions. Focus on understanding customer pain points deeply.",
    "🚀 When building your MVP, remember: minimum means essential features only. What's the smallest version that proves your core hypothesis?",
    "📈 Product-market fit happens when customers are pulling your product from you, not when you're pushing it to them.",
    "💰 For monetization, test willingness to pay early. A customer's wallet speaks louder than their words.",
    "🔄 Use the Build-Measure-Learn cycle. Every feature should be an experiment with clear success metrics.",
    "📊 Focus on actionable metrics, not vanity metrics. Track what drives real business value.",
    "🌟 Remember: every successful entrepreneur failed multiple times. Persistence and adaptation are your superpowers!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay and bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={onToggle}
        className="floating-chat animate-float"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Sparkles className="text-primary-foreground" size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Startup Mentor</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle} className="hover:bg-destructive/10">
          <X size={16} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
          >
            <div className={`flex gap-2 max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              {message.isBot && (
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-primary-foreground" />
                </div>
              )}
              <div 
                className={`p-3 rounded-2xl ${
                  message.isBot 
                    ? 'bg-muted/50 text-foreground rounded-tl-sm' 
                    : 'bg-primary text-primary-foreground rounded-tr-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-primary-foreground" />
              </div>
              <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-gradient-to-r from-background/95 to-muted/95 rounded-b-2xl">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message your AI mentor..."
              disabled={isTyping}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl text-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            size="sm" 
            disabled={!inputText.trim() || isTyping}
            className="w-10 h-10 rounded-xl p-0 hover-scale"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;