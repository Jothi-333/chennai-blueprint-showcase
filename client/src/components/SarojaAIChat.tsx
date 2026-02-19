import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Bot, 
  User, 
  Sparkles,
  Languages,
  Lightbulb,
  Thermometer,
  Lock,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SarojaAIChatProps {
  onDeviceControl?: (command: string) => void;
}

export default function SarojaAIChat({ onDeviceControl }: SarojaAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am Saroja, your AI home assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested commands
  const suggestions = language === 'en' ? [
    { icon: Lightbulb, text: "Activate movie time scene", command: "activate movie time scene" },
    { icon: Thermometer, text: "Activate goodnight scene", command: "activate goodnight scene" },
    { icon: Lock, text: "Activate leaving home scene", command: "activate leaving home scene" },
    { icon: Zap, text: "Show energy usage", command: "show energy consumption" },
  ] : [
    { icon: Lightbulb, text: "திரைப்பட காட்சி செயல்படுத்து", command: "activate movie time scene" },
    { icon: Thermometer, text: "குட்நைட் காட்சி செயல்படுத்து", command: "activate goodnight scene" },
    { icon: Lock, text: "வீட்டை விட்டு வெளியேறும் காட்சி", command: "activate leaving home scene" },
    { icon: Zap, text: "மின் பயன்பாடு காட்டு", command: "show power usage" },
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'ta-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition failed. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening... Speak now");
    }
  };

  const processCommand = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Scene activation
    if (lowerInput.includes('scene') || lowerInput.includes('காட்சி') || lowerInput.includes('activate')) {
      if (lowerInput.includes('movie') || lowerInput.includes('திரைப்பட')) {
        onDeviceControl?.('scene_movie_time');
        return "🎬 Movie Time scene activated! I've dimmed the lights to 20%, closed the curtains, turned on the TV, and set the AC to 24°C. Enjoy your movie!";
      }
      if (lowerInput.includes('goodnight') || lowerInput.includes('good night') || lowerInput.includes('குட்நைட்')) {
        onDeviceControl?.('scene_goodnight');
        return "🌙 Goodnight scene activated! All lights are off, doors are locked, bedroom AC is set to 26°C, and security is armed. Sleep well!";
      }
      if (lowerInput.includes('morning') || lowerInput.includes('good morning') || lowerInput.includes('காலை')) {
        onDeviceControl?.('scene_good_morning');
        return "☀️ Good Morning scene activated! Lights are on at 80%, AC is off, curtains are open, and water heater is on. Have a great day!";
      }
      if (lowerInput.includes('leaving') || lowerInput.includes('வெளியேறு')) {
        onDeviceControl?.('scene_leaving_home');
        return "🔒 Leaving Home scene activated! All lights and AC are off, doors are locked, security is armed, and water pump is off. Have a safe trip!";
      }
      if (lowerInput.includes('coming') || lowerInput.includes('home') || lowerInput.includes('வீட்டு')) {
        onDeviceControl?.('scene_coming_home');
        return "🏠 Welcome Home scene activated! Entrance lights are on, living room AC is set to 24°C, security is disarmed, and main door is unlocked. Welcome back!";
      }
      if (lowerInput.includes('energy') || lowerInput.includes('saving') || lowerInput.includes('மின்சாரம்')) {
        onDeviceControl?.('scene_energy_saving');
        return "⚡ Energy Saving scene activated! Unused lights are off, AC is set to 26°C, water heater is off, and solar mode is enabled. Saving energy!";
      }
    }

    // Light controls
    if (lowerInput.includes('light') || lowerInput.includes('விளக்கு')) {
      if (lowerInput.includes('on') || lowerInput.includes('இயக்கு')) {
        onDeviceControl?.('lights_on');
        return "I've turned on the lights. Is there anything else you need?";
      }
      if (lowerInput.includes('off') || lowerInput.includes('அணை')) {
        onDeviceControl?.('lights_off');
        return "I've turned off the lights. Anything else?";
      }
    }

    // Temperature controls
    if (lowerInput.includes('temperature') || lowerInput.includes('temp') || lowerInput.includes('குளிர்')) {
      const tempMatch = lowerInput.match(/(\d+)/);
      if (tempMatch) {
        const temp = tempMatch[1];
        onDeviceControl?.(`set_temp_${temp}`);
        return `I've set the temperature to ${temp}°C. The room should be comfortable in about 10 minutes.`;
      }
      return "I can help with temperature control. What temperature would you like?";
    }

    // AC controls
    if (lowerInput.includes('ac') || lowerInput.includes('air condition') || lowerInput.includes('குளிர்சாதன')) {
      if (lowerInput.includes('on') || lowerInput.includes('இயக்கு')) {
        onDeviceControl?.('ac_on');
        return "I've turned on the air conditioning. Setting it to a comfortable 24°C.";
      }
      if (lowerInput.includes('off') || lowerInput.includes('அணை')) {
        onDeviceControl?.('ac_off');
        return "I've turned off the air conditioning.";
      }
    }

    // Security
    if (lowerInput.includes('lock') || lowerInput.includes('பூட்டு')) {
      onDeviceControl?.('lock_doors');
      return "I've locked all doors. Your home is secure.";
    }

    if (lowerInput.includes('unlock') || lowerInput.includes('திற')) {
      onDeviceControl?.('unlock_door');
      return "I've unlocked the main door. Welcome home!";
    }

    // Energy/Power
    if (lowerInput.includes('energy') || lowerInput.includes('power') || lowerInput.includes('மின்')) {
      return "Current power consumption is 10.0 kW. Today you've used 28.5 kWh, which is 15% less than yesterday. Your solar panels generated 22 kWh. Great job on energy efficiency!";
    }

    // Water
    if (lowerInput.includes('water') || lowerInput.includes('tank') || lowerInput.includes('நீர்')) {
      return "The overhead water tank is at 75% capacity. The pump is currently off. Would you like me to turn it on?";
    }

    // Weather
    if (lowerInput.includes('weather') || lowerInput.includes('temperature outside') || lowerInput.includes('வானிலை')) {
      return "Current weather: 32°C with 65% humidity. It's a warm day in Chennai. I recommend keeping the AC on.";
    }

    // Automation controls
    if (lowerInput.includes('automation') || lowerInput.includes('rule') || lowerInput.includes('schedule')) {
      if (lowerInput.includes('enable') || lowerInput.includes('turn on')) {
        return "I can help you enable automation rules. Which automation would you like to enable? We have: Morning Routine, Evening Lights, Night Security, High Temperature AC, and Motion Detection Alert.";
      }
      if (lowerInput.includes('disable') || lowerInput.includes('turn off')) {
        return "I can help you disable automation rules. Which automation would you like to disable?";
      }
      return "You have 5 automation rules set up. 5 are currently enabled. Would you like to see the list or modify any?";
    }

    // Status check
    if (lowerInput.includes('status') || lowerInput.includes('how') || lowerInput.includes('நிலை')) {
      return "🏠 Home Status:\n✅ All systems online\n💡 12 lights on\n❄️ 3 ACs running (avg 24°C)\n🔒 All doors locked\n📹 4 cameras recording\n⚡ Power: 10.0 kW (Solar: 3.8 kW)\n💧 Water tank: 75%\n🔋 Battery: 85%";
    }

    // Help
    if (lowerInput.includes('help') || lowerInput.includes('what can you') || lowerInput.includes('உதவி')) {
      return "I can help you with:\n\n🎬 Scenes: Movie Time, Goodnight, Good Morning, Leaving Home, Coming Home, Energy Saving\n\n💡 Devices: Lights, AC, Doors, Security, Water Pump\n\n📊 Monitoring: Energy, Water, Weather, Cameras\n\n⚙️ Automation: Enable/disable rules, check status\n\nJust tell me what you need!";
    }

    // Default response
    return "I understand you want help with that. I can activate scenes, control devices, monitor your home, and manage automations. Try saying 'activate movie time scene' or 'help' to see what I can do!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Process command and get response
    const response = processCommand(input);

    // Add assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const handleSuggestionClick = (command: string) => {
    setInput(command);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 z-50 group"
        >
          <div className="relative">
            <Bot className="h-7 w-7" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col border-2">
          <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                Saroja AI Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                  className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
                >
                  <Languages className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-500/30">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Online
              </Badge>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                {language === 'en' ? 'English' : 'தமிழ்'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Quick commands:</p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSuggestionClick(suggestion.command)}
                      className="justify-start text-xs h-auto py-2"
                    >
                      <suggestion.icon className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'en' ? "Type a command..." : "கட்டளை தட்டச்சு செய்க..."}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleVoiceInput}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

