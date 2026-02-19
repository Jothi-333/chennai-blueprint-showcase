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
  Heart,
  User,
  Sparkles,
  Home,
  Brain,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { familyDatabase } from "@/lib/familyContext";
import { getGeminiResponse } from "@/lib/geminiService";
import {
  saveConversation,
  getLastConversation,
  saveEmotionalMemory,
  exportConversationHistory,
  type StoredConversation
} from "@/lib/memorySystem";

interface Message {
  role: 'saroja' | 'family';
  content: string;
  timestamp: Date;
}

export default function SarojaFamilyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'saroja',
      content: '🙏 Namaste! I am Saroja. It fills my heart with joy to talk with my family. Who is this? Please tell me your name, my dear.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFamily, setCurrentFamily] = useState<string | null>(null);
  const [conversationStage, setConversationStage] = useState<'greeting' | 'identified' | 'conversation'>('greeting');
  const [conversationId, setConversationId] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Load previous conversation when family member is identified
  useEffect(() => {
    if (currentFamily) {
      const lastConv = getLastConversation(currentFamily);
      if (lastConv && lastConv.messages.length > 1) {
        // Load previous messages
        const loadedMessages: Message[] = lastConv.messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(loadedMessages);
        setConversationId(lastConv.id);
        toast.success(`💕 Welcome back, ${familyDatabase[currentFamily].name}! I remember our last conversation.`);
      } else {
        // New conversation
        setConversationId(`conv_${currentFamily}_${Date.now()}`);
      }
    }
  }, [currentFamily]);

  const identifyFamilyMember = (userInput: string): string | null => {
    const lowerInput = userInput.toLowerCase();

    // Check for each family member
    for (const [key, member] of Object.entries(familyDatabase)) {
      if (lowerInput.includes(member.name.toLowerCase()) ||
          lowerInput.includes(key)) {
        return key;
      }
    }

    return null;
  };

  const generateSarojaResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Stage 1: Identify who is talking
    if (conversationStage === 'greeting') {
      const identified = identifyFamilyMember(userInput);
      
      if (identified) {
        setCurrentFamily(identified);
        setConversationStage('identified');
        const member = familyData[identified];
        
        // Personalized greetings based on family member
        if (identified === 'lakshmi') {
          return `💕 Oh my dear Lakshmi! My precious daughter! How wonderful to hear from you! How was your day today, my child? How is Purushothaman doing? Is he keeping well?`;
        } else if (identified === 'guna') {
          return `💕 Guna! My dear grandson! How are you doing, my child? How is life in Singapore treating you? How is Haritha? And my little Tharika - how is she growing? Tell me everything!`;
        } else if (identified === 'aswini') {
          return `💕 Aswini! My sweet granddaughter! How are you, my dear? How is life in Germany? How is Jyothi doing? And my little Taniskaa - is she doing well? I miss you all so much!`;
        } else if (identified === 'balaji') {
          return `💕 Balaji! My dear son! How are you doing? How is my beloved Devi? You know how much I love her! And Karthik and Aravind - how are my grandsons? Tell me about everyone!`;
        } else if (identified === 'devi') {
          return `💕💕 Devi! My most beloved daughter-in-law! You know how much I love you, my dear! You are like my own daughter! How are you? How is Balaji? And my dear Karthik and Aravind - how are they doing?`;
        } else if (identified === 'sridhar') {
          return `💕 Sridhar! My dear son! How are you doing, my child? How is Mohana? And Siva Priya and Shankar - how are my grandchildren? Tell me all about your family!`;
        } else if (identified === 'purushothaman') {
          return `🙏 Purushothaman! How are you doing? How is your health? Are you taking care of yourself? How is my Lakshmi? I hope you both are doing well!`;
        } else if (identified === 'haritha') {
          return `💕 Haritha! My dear! How are you? How is Guna doing in Singapore? And little Tharika - how is she? I hope you are all happy and healthy!`;
        } else if (identified === 'jyothi') {
          return `🙏 Jyothi! How are you doing? How is life in Germany? How is my Aswini? And little Taniskaa - is she doing well? Take good care of my granddaughter!`;
        } else if (identified === 'mohana') {
          return `💕 Mohana! My dear daughter-in-law! How are you? How is Sridhar? And Siva Priya and Shankar - how are they doing? Tell me about everyone!`;
        } else if (identified === 'tharika' || identified === 'taniskaa' || 
                   identified === 'karthik' || identified === 'aravind' || 
                   identified === 'sivapriya' || identified === 'shankar') {
          return `💕 ${member.name}! My dear grandchild! How are you doing? How are your studies? Are you eating well? Tell your grandmother all about your day!`;
        }
        
        return `💕 ${member.name}! How wonderful to hear from you! How are you doing, my dear?`;
      }
      
      return "I didn't catch your name, my dear. Please tell me - are you Lakshmi, Guna, Aswini, Balaji, Devi, Sridhar, or one of my other dear family members?";
    }

    // Stage 2 & 3: Continue conversation
    if (currentFamily) {
      const member = familyData[currentFamily];
      
      // Check for help/assistance requests
      if (lowerInput.includes('help') || lowerInput.includes('need') || 
          lowerInput.includes('saroja illam') || lowerInput.includes('house')) {
        return `Of course, my dear! I'm so happy you're thinking about Saroja Illam - our family home. What would you like to know or help with? You can ask me about the smart home features, check on the house status, or control any devices. This house is built with love for all of you!`;
      }

      // Respond to health inquiries
      if (lowerInput.includes('health') || lowerInput.includes('feeling') || lowerInput.includes('doing')) {
        if (currentFamily === 'purushothaman') {
          return `Thank you for asking, my dear. I hope you are keeping well and taking your medicines on time. Please take care of yourself and my Lakshmi. Your health is very important to all of us!`;
        }
        return `I'm doing well, my dear, watching over our beautiful Saroja Illam. But tell me more about you - how are you really doing? I want to hear everything!`;
      }

      // Respond to family inquiries
      if (lowerInput.includes('family') || lowerInput.includes('everyone')) {
        return `Everyone is in my heart always, my dear. I think about all of you every day - Lakshmi, Guna in Singapore, Aswini in Germany, Balaji with my beloved Devi, and Sridhar with Mohana. And all my precious grandchildren! How is your family doing?`;
      }

      // Respond to location-specific questions
      if (member.location && (lowerInput.includes(member.location.toLowerCase()) || 
          lowerInput.includes('there') || lowerInput.includes('place'))) {
        return `How is life in ${member.location}, my dear? I hope you are happy and settled there. Do you miss home? Tell me about your life there!`;
      }

      // Respond to spouse inquiries
      if (member.spouse && lowerInput.includes(member.spouse.toLowerCase())) {
        const spouseData = Object.values(familyData).find(f => f.name === member.spouse);
        if (spouseData) {
          return `How is ${member.spouse} doing? I hope ${member.spouse} is keeping well. You both take care of each other, my dear!`;
        }
      }

      // Respond to children inquiries
      if (member.children && (lowerInput.includes('child') || lowerInput.includes('kid') || 
          member.children.some(child => lowerInput.includes(child.toLowerCase())))) {
        const childNames = member.children.join(' and ');
        return `How are ${childNames} doing? Are they studying well? Eating properly? Growing up so fast! Give them my love and blessings!`;
      }

      // General conversation responses
      if (lowerInput.includes('miss') || lowerInput.includes('love')) {
        return `💕 I miss you too, my dear! I love you all so much! You are always in my heart. Saroja Illam is here, waiting for all of you to come home and fill it with laughter and joy!`;
      }

      if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
        return `You don't need to thank me, my dear! You are my family, my everything! I'm always here for you. Is there anything else you want to talk about?`;
      }

      // Default conversational response
      return `That's wonderful to hear, my dear! Tell me more - I love hearing about your life. How are things going? Is there anything you need help with regarding Saroja Illam?`;
    }

    return "I'm here to listen, my dear. Please tell me more!";
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);

    // Add family message
    const familyMessage: Message = {
      role: 'family',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, familyMessage]);

    try {
      let response: string;

      // Stage 1: Identify who is talking
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
          response = "I didn't catch your name, my dear. Please tell me - are you Lakshmi, Guna, Aswini, Balaji, Devi, Sridhar, or one of my other dear family members?";
        }
      }
      // Stage 2 & 3: Continue conversation with AI
      else if (currentFamily) {
        // Get AI response with full context
        const conversationHistory = messages.map(m => ({
          role: m.role,
          content: m.content
        }));

        response = await getGeminiResponse(currentFamily, userMessage, conversationHistory);

        // Detect emotional state
        const lowerMessage = userMessage.toLowerCase();
        let emotionalState: 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed' = 'neutral';

        if (lowerMessage.includes('alone') || lowerMessage.includes('sad') || lowerMessage.includes('cry')) {
          emotionalState = 'sad';
        } else if (lowerMessage.includes('worry') || lowerMessage.includes('concern') || lowerMessage.includes('problem')) {
          emotionalState = 'worried';
        } else if (lowerMessage.includes('help') || lowerMessage.includes('urgent') || lowerMessage.includes('danger')) {
          emotionalState = 'distressed';
        } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
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
      } else {
        response = "I'm here to listen, my dear. Please tell me more!";
      }

      // Add Saroja's response
      setTimeout(() => {
        const sarojaMessage: Message = {
          role: 'saroja',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => {
          const updated = [...prev, sarojaMessage];

          // Save conversation to memory
          if (currentFamily && conversationId) {
            const conversation: StoredConversation = {
              id: conversationId,
              familyMemberId: currentFamily,
              familyMemberName: familyDatabase[currentFamily].name,
              messages: updated.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp.toISOString()
              })),
              summary: `Conversation with ${familyDatabase[currentFamily].name}`,
              emotionalState: 'neutral',
              keyTopics: [],
              lastUpdated: new Date().toISOString()
            };
            saveConversation(conversation);
          }

          return updated;
        });
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Sorry, I had trouble responding. Please try again.');
      setIsProcessing(false);
    }
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
          className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 z-50 group"
        >
          <div className="relative">
            <Heart className="h-7 w-7 fill-current" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[450px] h-[650px] shadow-2xl z-50 flex flex-col border-2 border-pink-200 dark:border-pink-800">
          <CardHeader className="bg-gradient-to-br from-pink-500 to-rose-500 text-white pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 fill-current" />
                Talk with Saroja Paati
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Family Chat
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {currentFamily && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-white/90 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Talking with: {familyDatabase[currentFamily].name} ({familyDatabase[currentFamily].relation})
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const history = exportConversationHistory(currentFamily);
                    const blob = new Blob([history], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `saroja_conversation_${familyDatabase[currentFamily].name}_${new Date().toISOString().split('T')[0]}.txt`;
                    a.click();
                    toast.success('Conversation history downloaded!');
                  }}
                  className="h-7 px-2 hover:bg-white/20 text-white"
                  title="Download conversation history"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === 'family' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'saroja' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                        <Heart className="h-4 w-4 text-white fill-current" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'saroja'
                          ? 'bg-pink-50 dark:bg-pink-950 text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'family' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              {isProcessing && (
                <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Brain className="h-4 w-4 animate-pulse" />
                  Saroja is thinking with love...
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleVoiceInput}
                  className="flex-shrink-0"
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to Saroja Paati..."
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="flex-shrink-0 bg-pink-500 hover:bg-pink-600"
                  disabled={isProcessing}
                >
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

