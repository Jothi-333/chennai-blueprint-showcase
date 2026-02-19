import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Mic,
  MicOff,
  X,
  Bot,
  Heart,
  User,
  Sparkles,
  Home,
  Brain,
  Download,
  Lightbulb,
  Thermometer,
  Lock,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { familyDatabase } from "@/lib/familyContext";
import { getGeminiResponse } from "@/lib/geminiService";
import {
  saveConversation,
  getLastConversation,
  saveEmotionalMemory,
  exportConversationHistory,
} from "@/lib/memorySystem";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode?: 'smart-home' | 'family-chat';
}

type ChatMode = 'smart-home' | 'family-chat';

interface UnifiedSarojaChatProps {
  onDeviceControl?: (command: string) => void;
}

export default function UnifiedSarojaChat({ onDeviceControl }: UnifiedSarojaChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('smart-home');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '🙏 Namaste! I am Saroja. I can help you control your smart home or chat with you like family. How can I help you today?',
      timestamp: new Date(),
      mode: 'smart-home'
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFamily, setCurrentFamily] = useState<string | null>(null);
  const [conversationStage, setConversationStage] = useState<'greeting' | 'identified' | 'conversation'>('greeting');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Smart home command keywords
  const smartHomeKeywords = [
    'light', 'lights', 'lamp', 'bulb',
    'ac', 'air conditioning', 'temperature', 'cool', 'heat', 'climate',
    'door', 'lock', 'unlock', 'security',
    'scene', 'movie', 'goodnight', 'morning', 'leaving', 'coming', 'energy saving',
    'camera', 'cameras', 'monitor',
    'power', 'energy', 'consumption',
    'water', 'pump', 'tank',
    'solar', 'battery',
    'turn on', 'turn off', 'switch', 'activate', 'deactivate',
    'status', 'show me'
  ];

  // Family chat keywords
  const familyChatKeywords = [
    'lakshmi', 'guna', 'gunasekaran', 'aswini', 'balaji', 'devi', 'sridhar', 'mohana',
    'purushothaman', 'haritha', 'jyothi', 'tharika', 'taniskaa', 'karthik', 'aravind',
    'sivapriya', 'shankar', 'daughter', 'son', 'grandchild', 'grandson', 'granddaughter',
    'paati', 'grandmother', 'amma', 'family', 'i am', 'this is',
    'my name', 'hello', 'hi', 'namaste', 'vanakkam', 'who are you', 'tell me about'
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
      recognitionRef.current.lang = 'en-US';

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
  }, []);

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

  // Detect chat mode based on user input
  const detectChatMode = (userInput: string): ChatMode => {
    const lowerInput = userInput.toLowerCase();

    // Check for family chat keywords first (higher priority for personal conversations)
    const hasFamilyKeyword = familyChatKeywords.some(keyword => lowerInput.includes(keyword));
    const hasSmartHomeKeyword = smartHomeKeywords.some(keyword => lowerInput.includes(keyword));

    // Personal questions should go to family chat mode
    const personalQuestions = ['how are you', 'how do you feel', 'are you okay', 'are you well',
                               'what are you doing', 'how have you been', 'how is your day'];
    const isPersonalQuestion = personalQuestions.some(q => lowerInput.includes(q));

    // If already in family chat mode and identified, stay in family mode unless explicitly smart home command
    if (chatMode === 'family-chat' && currentFamily && !hasSmartHomeKeyword) {
      return 'family-chat';
    }

    // Personal questions go to family chat
    if (isPersonalQuestion) {
      return 'family-chat';
    }

    // Family keywords take priority
    if (hasFamilyKeyword) {
      return 'family-chat';
    }

    // Smart home keywords
    if (hasSmartHomeKeyword) {
      return 'smart-home';
    }

    // If no clear keywords, check if it's a greeting or personal message
    const greetingPatterns = /^(hi|hello|hey|namaste|vanakkam|good morning|good evening)/i;
    if (greetingPatterns.test(lowerInput)) {
      return 'family-chat';
    }

    // Default to current mode
    return chatMode;
  };

  // Identify family member
  const identifyFamilyMember = (userInput: string): string | null => {
    const lowerInput = userInput.toLowerCase();

    for (const [key, member] of Object.entries(familyDatabase)) {
      if (lowerInput.includes(member.name.toLowerCase()) || lowerInput.includes(key)) {
        return key;
      }
    }

    return null;
  };

  // Process smart home commands
  const processSmartHomeCommand = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Lights control
    if (lowerInput.includes('turn on') && lowerInput.includes('light')) {
      onDeviceControl?.('lights_on');
      return "✅ All lights have been turned on!";
    }
    if (lowerInput.includes('turn off') && lowerInput.includes('light')) {
      onDeviceControl?.('lights_off');
      return "✅ All lights have been turned off!";
    }

    // AC control
    if (lowerInput.includes('turn on') && (lowerInput.includes('ac') || lowerInput.includes('air conditioning'))) {
      onDeviceControl?.('ac_on');
      return "❄️ Air conditioning turned on!";
    }
    if (lowerInput.includes('turn off') && (lowerInput.includes('ac') || lowerInput.includes('air conditioning'))) {
      onDeviceControl?.('ac_off');
      return "✅ Air conditioning turned off!";
    }

    // Temperature control
    const tempMatch = lowerInput.match(/set.*?(\d+)/);
    if (tempMatch && (lowerInput.includes('temperature') || lowerInput.includes('temp') || lowerInput.includes('ac'))) {
      const temp = parseInt(tempMatch[1]);
      onDeviceControl?.(`set_temp_${temp}`);
      return `🌡️ Temperature set to ${temp}°C!`;
    }

    // Door locks
    if (lowerInput.includes('lock') && lowerInput.includes('door')) {
      onDeviceControl?.('lock_doors');
      return "🔒 All doors have been locked!";
    }
    if (lowerInput.includes('unlock') && lowerInput.includes('door')) {
      onDeviceControl?.('unlock_door');
      return "🔓 Main door unlocked!";
    }

    // Scenes
    if (lowerInput.includes('movie') || lowerInput.includes('movie time')) {
      onDeviceControl?.('scene_movie_time');
      return "🎬 Movie Time scene activated! Enjoy your movie!";
    }
    if (lowerInput.includes('goodnight') || lowerInput.includes('good night')) {
      onDeviceControl?.('scene_goodnight');
      return "🌙 Goodnight scene activated! Sleep well!";
    }
    if (lowerInput.includes('good morning') || lowerInput.includes('morning')) {
      onDeviceControl?.('scene_good_morning');
      return "☀️ Good Morning scene activated! Have a great day!";
    }
    if (lowerInput.includes('leaving home') || lowerInput.includes('going out')) {
      onDeviceControl?.('scene_leaving_home');
      return "🔒 Leaving Home scene activated! Everything is secured!";
    }
    if (lowerInput.includes('coming home') || lowerInput.includes('i\'m home')) {
      onDeviceControl?.('scene_coming_home');
      return "🏠 Welcome Home scene activated! Welcome back!";
    }
    if (lowerInput.includes('energy saving') || lowerInput.includes('save energy')) {
      onDeviceControl?.('scene_energy_saving');
      return "⚡ Energy Saving scene activated! Saving power!";
    }

    // Status check
    if (lowerInput.includes('status') || lowerInput.includes('how') || lowerInput.includes('show')) {
      return "🏠 Home Status:\n✅ All systems online\n💡 Lights: Active\n❄️ Climate: Controlled\n🔒 Security: Armed\n⚡ Power: Normal\n💧 Water: 75%\n🔋 Battery: 85%";
    }

    // Help
    if (lowerInput.includes('help') || lowerInput.includes('what can you')) {
      return "I can help you with:\n\n🎬 Scenes: Movie Time, Goodnight, Good Morning, Leaving Home, Coming Home, Energy Saving\n\n💡 Devices: Lights, AC, Doors, Security\n\n📊 Monitoring: Energy, Water, Status\n\nOr chat with me like family! Just tell me your name.";
    }

    return "I can help you control your home or chat with you. Try 'turn on lights', 'activate movie scene', or tell me your name to chat!";
  };

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Detect mode
    const detectedMode = detectChatMode(userMessage);
    setChatMode(detectedMode);

    setIsProcessing(true);

    try {
      let response: string;
      let responseMode: ChatMode = detectedMode;

      if (detectedMode === 'family-chat') {
        // Family chat mode with Gemini AI
        if (conversationStage === 'greeting') {
          const identified = identifyFamilyMember(userMessage);

          if (identified) {
            setCurrentFamily(identified);
            setConversationStage('identified');

            // Use Gemini for personalized greeting
            response = await getGeminiResponse(identified, userMessage, []);

            // Save emotional memory
            saveEmotionalMemory({
              familyMemberId: identified,
              timestamp: new Date(),
              topic: 'Initial greeting',
              emotionalState: 'neutral',
              keyPoints: ['Family member identified', 'Conversation started']
            });
          } else {
            // If no family member identified but it's a personal question, respond warmly
            const personalQuestions = ['how are you', 'how do you feel', 'are you okay'];
            const isPersonalQ = personalQuestions.some(q => userMessage.toLowerCase().includes(q));

            if (isPersonalQ) {
              response = "💕 I'm doing well, my dear! But I don't know who I'm talking to yet. Please tell me your name - are you Lakshmi, Guna, Aswini, Balaji, Devi, Sridhar, or one of my other dear family members? Then we can have a proper conversation!";
            } else {
              response = "I didn't catch your name, my dear. Please tell me - are you Lakshmi, Guna, Aswini, Balaji, Devi, Sridhar, or one of my other dear family members?";
            }
          }
        } else if (currentFamily) {
          // Ongoing conversation with Gemini
          const conversationHistory = messages
            .filter(m => m.mode === 'family-chat')
            .map(m => ({
              role: m.role === 'user' ? 'user' as const : 'model' as const,
              parts: [{ text: m.content }]
            }));

          response = await getGeminiResponse(currentFamily, userMessage, conversationHistory);

          // Detect emotional state
          const lowerMsg = userMessage.toLowerCase();
          let emotionalState: 'happy' | 'sad' | 'worried' | 'distressed' | 'neutral' = 'neutral';
          if (lowerMsg.includes('sad') || lowerMsg.includes('upset') || lowerMsg.includes('cry')) {
            emotionalState = 'sad';
          } else if (lowerMsg.includes('worried') || lowerMsg.includes('concern') || lowerMsg.includes('anxious')) {
            emotionalState = 'worried';
          } else if (lowerMsg.includes('help') || lowerMsg.includes('problem') || lowerMsg.includes('difficult')) {
            emotionalState = 'distressed';
          } else if (lowerMsg.includes('happy') || lowerMsg.includes('good') || lowerMsg.includes('great')) {
            emotionalState = 'happy';
          }

          // Save emotional memory
          saveEmotionalMemory({
            familyMemberId: currentFamily,
            timestamp: new Date(),
            topic: userMessage.substring(0, 50),
            emotionalState,
            keyPoints: [userMessage]
          });

          // Save conversation
          saveConversation({
            id: `${currentFamily}_${Date.now()}`,
            familyMemberId: currentFamily,
            messages: messages.filter(m => m.mode === 'family-chat').map(m => ({
              role: m.role === 'user' ? 'family' : 'saroja',
              content: m.content,
              timestamp: m.timestamp
            })),
            startTime: messages[0].timestamp,
            lastUpdated: new Date()
          });

          setConversationStage('conversation');
        } else {
          response = "Please tell me your name first, my dear. Are you Lakshmi, Guna, Aswini, or another family member?";
        }
      } else {
        // Smart home mode
        response = processSmartHomeCommand(userMessage);
        responseMode = 'smart-home';
      }

      // Add assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          mode: responseMode
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
      }, 500);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, my dear. I had trouble understanding that. Could you please try again?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
      toast.error("Error processing your message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownloadHistory = () => {
    if (currentFamily) {
      exportConversationHistory(currentFamily);
      toast.success("Conversation history downloaded!");
    } else {
      toast.error("No conversation history to download");
    }
  };

  // Suggested quick actions based on mode
  const quickSuggestions = chatMode === 'smart-home' ? [
    { icon: Lightbulb, text: "Turn on all lights", command: "turn on all lights" },
    { icon: Thermometer, text: "Activate goodnight scene", command: "activate goodnight scene" },
    { icon: Lock, text: "Lock all doors", command: "lock all doors" },
    { icon: Zap, text: "Show home status", command: "show home status" },
  ] : [
    { icon: Heart, text: "How are you?", command: "How are you doing today?" },
    { icon: Home, text: "Tell me about Chennai", command: "Tell me about our home in Chennai" },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl border-4 border-white/30 bg-gradient-to-br from-pink-600 via-pink-500 to-rose-600 hover:from-pink-700 hover:via-pink-600 hover:to-rose-700 z-50 group animate-pulse hover:animate-none"
        >
          <div className="relative">
            {chatMode === 'family-chat' ? (
              <Heart className="h-8 w-8 fill-current text-white" />
            ) : (
              <Bot className="h-8 w-8 text-white" />
            )}
            <Sparkles className="h-5 w-5 absolute -top-1 -right-1 text-yellow-300 animate-spin" />
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[450px] h-[650px] shadow-2xl z-50 flex flex-col border-4 border-white/20 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className={`${chatMode === 'family-chat' ? 'bg-gradient-to-r from-pink-600 via-pink-500 to-rose-600' : 'bg-gradient-to-r from-orange-600 via-orange-500 to-red-600'} text-white p-4 shadow-lg`}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                {chatMode === 'family-chat' ? (
                  <Heart className="h-6 w-6 fill-current" />
                ) : (
                  <Bot className="h-6 w-6" />
                )}
                Saroja {chatMode === 'family-chat' ? 'Paati' : 'AI Assistant'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/30 text-white border-0 hover:bg-white/40">
                  {chatMode === 'family-chat' ? 'Family Chat' : 'Smart Home'}
                </Badge>
                {currentFamily && chatMode === 'family-chat' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDownloadHistory}
                    className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                    title="Download conversation history"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {isProcessing && chatMode === 'family-chat' && (
                  <Brain className="h-5 w-5 animate-pulse" />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {currentFamily && chatMode === 'family-chat' && (
              <div className="mt-2 text-sm text-white/95 font-medium">
                💕 Chatting with {familyDatabase[currentFamily]?.name}
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-slate-900/50" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${message.mode === 'family-chat' ? 'bg-gradient-to-br from-pink-500 to-rose-500' : 'bg-gradient-to-br from-orange-500 to-red-500'}`}>
                        {message.mode === 'family-chat' ? (
                          <Heart className="h-5 w-5 text-white fill-current" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-blue-400'
                          : message.mode === 'family-chat'
                          ? 'bg-gradient-to-br from-pink-50 to-rose-50 text-gray-900 border-2 border-pink-300 shadow-pink-200/50'
                          : 'bg-gradient-to-br from-orange-50 to-red-50 text-gray-900 border-2 border-orange-300 shadow-orange-200/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                      <p className={`text-xs mt-2 font-semibold ${message.role === 'user' ? 'text-blue-200' : 'text-gray-600'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-3 bg-slate-800/80 border-t border-slate-700">
                <p className="text-xs font-semibold text-slate-300 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => setInput(suggestion.command)}
                      className={`text-xs border-2 hover:scale-105 transition-transform text-white ${chatMode === 'family-chat' ? 'border-pink-400 bg-pink-600/20 hover:bg-pink-600/40' : 'border-orange-400 bg-orange-600/20 hover:bg-orange-600/40'}`}
                    >
                      <suggestion.icon className="h-3 w-3 mr-1" />
                      {suggestion.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t-4 border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl">
              {isProcessing && (
                <div className="mb-3 text-sm font-bold flex items-center gap-2 text-white bg-purple-600/30 px-3 py-2 rounded-lg border border-purple-500/50">
                  <Brain className="h-5 w-5 animate-pulse text-purple-300" />
                  {chatMode === 'family-chat' ? 'Saroja is thinking with love...' : 'Processing your command...'}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleVoiceInput}
                  className={`flex-shrink-0 h-12 w-12 border-3 shadow-lg ${isListening ? 'bg-red-600 border-red-400' : 'bg-slate-700 border-slate-500 hover:bg-slate-600 text-white'}`}
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={chatMode === 'family-chat' ? "Type your message to Saroja Paati..." : "Ask me to control your home..."}
                  className="flex-1 h-12 border-3 border-white/30 bg-white text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-white/60 font-medium text-base shadow-lg rounded-xl px-4"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className={`flex-shrink-0 h-12 w-12 shadow-xl border-2 border-white/30 ${chatMode === 'family-chat' ? 'bg-gradient-to-br from-pink-600 via-pink-500 to-rose-600 hover:from-pink-700 hover:via-pink-600 hover:to-rose-700' : 'bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 hover:from-orange-700 hover:via-orange-600 hover:to-red-700'}`}
                  disabled={isProcessing || !input.trim()}
                >
                  <Send className="h-6 w-6" />
                </Button>
              </div>
              <div className="mt-3 text-xs font-bold text-center">
                <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full shadow-lg border-2 ${chatMode === 'family-chat' ? 'bg-gradient-to-r from-pink-600 to-rose-600 border-pink-400 text-white' : 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-400 text-white'}`}>
                  {chatMode === 'family-chat' ? '💕 Family chat mode' : '🏠 Smart home mode'} • Switches automatically
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}


