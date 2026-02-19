// Zustand store for Saroja AI Chatbot with Immer and Persist middleware
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode?: 'smart-home' | 'family-chat';
}

export type ChatMode = 'smart-home' | 'family-chat';
export type ConversationStage = 'greeting' | 'identified' | 'conversation';

export interface EmotionalMemory {
  familyMemberId: string;
  timestamp: Date;
  topic: string;
  emotionalState: 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed';
  keyPoints: string[];
}

export interface ConversationSession {
  id: string;
  familyMemberId: string;
  messages: Message[];
  startTime: Date;
  lastUpdated: Date;
  emotionalState: 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed';
  keyTopics: string[];
}

interface ChatState {
  // UI State
  isOpen: boolean;
  isProcessing: boolean;
  isListening: boolean;
  
  // Chat State
  chatMode: ChatMode;
  messages: Message[];
  input: string;
  
  // Family Chat State
  currentFamily: string | null;
  conversationStage: ConversationStage;
  currentSessionId: string | null;
  
  // Memory State
  conversationSessions: Record<string, ConversationSession>;
  emotionalMemories: EmotionalMemory[];
  
  // Actions - UI
  setIsOpen: (isOpen: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsListening: (isListening: boolean) => void;
  toggleOpen: () => void;
  
  // Actions - Chat
  setChatMode: (mode: ChatMode) => void;
  setInput: (input: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  clearMessages: () => void;
  
  // Actions - Family Chat
  setCurrentFamily: (familyId: string | null) => void;
  setConversationStage: (stage: ConversationStage) => void;
  identifyFamily: (familyId: string) => void;
  
  // Actions - Memory
  saveEmotionalMemory: (memory: EmotionalMemory) => void;
  getConversationHistory: (familyId: string) => Message[];
  saveCurrentSession: () => void;
  loadSession: (familyId: string) => void;
  
  // Actions - Reset
  resetChat: () => void;
  resetFamilyChat: () => void;
}

const initialState = {
  isOpen: false,
  isProcessing: false,
  isListening: false,
  chatMode: 'smart-home' as ChatMode,
  messages: [
    {
      id: 'welcome',
      role: 'assistant' as const,
      content: '🙏 Namaste! I am Saroja. I can help you control your smart home or chat with you like family. How can I help you today?',
      timestamp: new Date(),
      mode: 'smart-home' as const
    }
  ],
  input: '',
  currentFamily: null,
  conversationStage: 'greeting' as ConversationStage,
  currentSessionId: null,
  conversationSessions: {},
  emotionalMemories: [],
};

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // UI Actions
        setIsOpen: (isOpen) => set({ isOpen }),
        setIsProcessing: (isProcessing) => set({ isProcessing }),
        setIsListening: (isListening) => set({ isListening }),
        toggleOpen: () => set((state) => { state.isOpen = !state.isOpen; }),
        
        // Chat Actions
        setChatMode: (mode) => set({ chatMode: mode }),
        setInput: (input) => set({ input }),
        
        addMessage: (message) => set((state) => {
          const newMessage: Message = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: message.timestamp || new Date()
          };
          state.messages.push(newMessage);
        }),
        
        clearMessages: () => set((state) => {
          state.messages = [initialState.messages[0]];
        }),
        
        // Family Chat Actions
        setCurrentFamily: (familyId) => set({ currentFamily: familyId }),
        setConversationStage: (stage) => set({ conversationStage: stage }),
        
        identifyFamily: (familyId) => set((state) => {
          state.currentFamily = familyId;
          state.conversationStage = 'identified';
          state.chatMode = 'family-chat';
          
          // Create new session
          const sessionId = `session_${familyId}_${Date.now()}`;
          state.currentSessionId = sessionId;
          
          // Load previous session if exists
          const previousSession = Object.values(state.conversationSessions)
            .filter(s => s.familyMemberId === familyId)
            .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())[0];
          
          if (previousSession) {
            // Optionally load previous messages
            console.log('Previous session found:', previousSession);
          }
        }),
        
        // Memory Actions
        saveEmotionalMemory: (memory) => set((state) => {
          state.emotionalMemories.push(memory);
          // Keep only last 100 memories
          if (state.emotionalMemories.length > 100) {
            state.emotionalMemories = state.emotionalMemories.slice(-100);
          }
        }),
        
        getConversationHistory: (familyId) => {
          const sessions = Object.values(get().conversationSessions)
            .filter(s => s.familyMemberId === familyId)
            .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

          return sessions.flatMap(s => s.messages);
        },

        saveCurrentSession: () => set((state) => {
          const { currentFamily, currentSessionId, messages, chatMode } = state;

          if (!currentFamily || !currentSessionId || chatMode !== 'family-chat') return;

          const familyMessages = messages.filter(m => m.mode === 'family-chat');

          if (familyMessages.length === 0) return;

          // Detect emotional state from messages
          const lastMessage = familyMessages[familyMessages.length - 1];
          const emotionalState = detectEmotionalState(lastMessage.content);

          // Extract key topics (simple implementation)
          const keyTopics = extractKeyTopics(familyMessages);

          state.conversationSessions[currentSessionId] = {
            id: currentSessionId,
            familyMemberId: currentFamily,
            messages: familyMessages,
            startTime: familyMessages[0].timestamp,
            lastUpdated: new Date(),
            emotionalState,
            keyTopics
          };
        }),

        loadSession: (familyId) => set((state) => {
          const sessions = Object.values(state.conversationSessions)
            .filter(s => s.familyMemberId === familyId)
            .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

          if (sessions.length > 0) {
            const latestSession = sessions[0];
            // Optionally restore messages
            console.log('Loading session:', latestSession);
          }
        }),

        // Reset Actions
        resetChat: () => set(initialState),

        resetFamilyChat: () => set((state) => {
          state.currentFamily = null;
          state.conversationStage = 'greeting';
          state.currentSessionId = null;
          state.chatMode = 'smart-home';
        }),
      })),
      {
        name: 'saroja-chat-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // Only persist these fields
          conversationSessions: state.conversationSessions,
          emotionalMemories: state.emotionalMemories,
          // Don't persist UI state or current messages
        }),
      }
    ),
    { name: 'SarojaChatStore' }
  )
);

// Helper functions
function detectEmotionalState(content: string): 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed' {
  const lowerContent = content.toLowerCase();

  if (lowerContent.match(/sad|depressed|down|unhappy|crying/)) return 'sad';
  if (lowerContent.match(/worried|anxious|concerned|stressed|nervous/)) return 'worried';
  if (lowerContent.match(/distressed|desperate|help|emergency/)) return 'distressed';
  if (lowerContent.match(/happy|joy|excited|great|wonderful|amazing/)) return 'happy';

  return 'neutral';
}

function extractKeyTopics(messages: Message[]): string[] {
  // Simple keyword extraction - can be enhanced with NLP
  const topics = new Set<string>();
  const keywords = ['family', 'work', 'health', 'legal', 'money', 'children', 'home', 'travel'];

  messages.forEach(msg => {
    const lowerContent = msg.content.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        topics.add(keyword);
      }
    });
  });

  return Array.from(topics);
}

