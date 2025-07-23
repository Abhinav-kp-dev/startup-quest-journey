import { useState } from "react";
import { Bot, Send, X, MessageCircle } from "lucide-react";
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
      text: "Hi! I'm your startup mentor bot. I'm here to help you navigate your entrepreneurial journey. What phase are you working on?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const botResponses = [
    "That's a great question! For the validation phase, I recommend starting with customer interviews.",
    "Building an MVP is exciting! Focus on core features that solve your main problem.",
    "Launching can be nerve-wracking, but remember - done is better than perfect!",
    "For monetization, consider multiple revenue streams but start with the simplest one.",
    "Feedback is gold! Use it to iterate and improve your product continuously.",
    "Scaling requires systems. Document your processes as you grow!",
    "Remember, every successful entrepreneur started exactly where you are now. Keep going!"
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
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
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="text-primary" size={20} />
          <h3 className="font-semibold">Startup Mentor</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot 
                  ? 'bg-muted text-foreground' 
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;