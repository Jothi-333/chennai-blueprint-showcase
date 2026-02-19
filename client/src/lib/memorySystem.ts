// Memory System for Saroja AI - Persistent conversation memory

import { ConversationMemory } from './familyContext';

export interface StoredConversation {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  messages: {
    role: 'saroja' | 'family';
    content: string;
    timestamp: string;
  }[];
  summary: string;
  emotionalState: 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed';
  keyTopics: string[];
  lastUpdated: string;
}

const STORAGE_KEY = 'saroja_conversation_memory';
const MEMORY_KEY = 'saroja_emotional_memory';

// Save conversation to localStorage
export function saveConversation(conversation: StoredConversation): void {
  try {
    const existing = getAllConversations();
    const index = existing.findIndex(c => c.id === conversation.id);
    
    if (index >= 0) {
      existing[index] = conversation;
    } else {
      existing.push(conversation);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save conversation:', error);
  }
}

// Get all conversations
export function getAllConversations(): StoredConversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load conversations:', error);
    return [];
  }
}

// Get conversations for a specific family member
export function getConversationsByMember(familyMemberId: string): StoredConversation[] {
  const all = getAllConversations();
  return all.filter(c => c.familyMemberId === familyMemberId);
}

// Get the most recent conversation for a family member
export function getLastConversation(familyMemberId: string): StoredConversation | null {
  const conversations = getConversationsByMember(familyMemberId);
  if (conversations.length === 0) return null;
  
  return conversations.sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  )[0];
}

// Save emotional memory (key events, concerns, follow-ups)
export function saveEmotionalMemory(memory: ConversationMemory): void {
  try {
    const existing = getAllEmotionalMemories();
    existing.push({
      ...memory,
      timestamp: memory.timestamp.toISOString()
    });
    
    // Keep only last 100 memories
    const trimmed = existing.slice(-100);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save emotional memory:', error);
  }
}

// Get all emotional memories
export function getAllEmotionalMemories(): any[] {
  try {
    const data = localStorage.getItem(MEMORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load emotional memories:', error);
    return [];
  }
}

// Get emotional memories for a specific family member
export function getEmotionalMemoriesByMember(familyMemberId: string): any[] {
  const all = getAllEmotionalMemories();
  return all.filter(m => m.familyMemberId === familyMemberId);
}

// Generate conversation summary for context
export function generateConversationContext(familyMemberId: string): string {
  const lastConv = getLastConversation(familyMemberId);
  const memories = getEmotionalMemoriesByMember(familyMemberId);
  
  let context = '';
  
  if (lastConv) {
    context += `Last conversation: ${lastConv.summary}\n`;
    context += `Emotional state: ${lastConv.emotionalState}\n`;
    context += `Topics discussed: ${lastConv.keyTopics.join(', ')}\n`;
  }
  
  if (memories.length > 0) {
    const recentMemories = memories.slice(-5);
    context += `\nRecent concerns:\n`;
    recentMemories.forEach(m => {
      context += `- ${m.topic} (${m.emotionalState})\n`;
    });
  }
  
  return context;
}

// Clear all memory (for testing or reset)
export function clearAllMemory(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(MEMORY_KEY);
}

// Export conversation history as text
export function exportConversationHistory(familyMemberId: string): string {
  const conversations = getConversationsByMember(familyMemberId);
  let text = `Conversation History with ${conversations[0]?.familyMemberName || 'Family Member'}\n`;
  text += `${'='.repeat(60)}\n\n`;
  
  conversations.forEach(conv => {
    text += `Date: ${new Date(conv.lastUpdated).toLocaleString()}\n`;
    text += `Emotional State: ${conv.emotionalState}\n`;
    text += `Topics: ${conv.keyTopics.join(', ')}\n`;
    text += `\nMessages:\n`;
    conv.messages.forEach(msg => {
      text += `[${msg.role.toUpperCase()}]: ${msg.content}\n`;
    });
    text += `\n${'-'.repeat(60)}\n\n`;
  });
  
  return text;
}

