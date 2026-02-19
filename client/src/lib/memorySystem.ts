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
    // Handle undefined keyTopics (for old conversations in localStorage)
    if (lastConv.keyTopics && Array.isArray(lastConv.keyTopics)) {
      context += `Topics discussed: ${lastConv.keyTopics.join(', ')}\n`;
    }
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

// ========== ENHANCED MEMORY FEATURES ==========

export interface Promise {
  id: string;
  familyMemberId: string;
  promise: string;
  madeOn: Date;
  dueDate?: Date;
  fulfilled: boolean;
  fulfilledOn?: Date;
  notes?: string;
}

export interface Preference {
  familyMemberId: string;
  category: 'food' | 'activity' | 'communication' | 'other';
  preference: string;
  learnedOn: Date;
}

const PROMISES_KEY = 'saroja_promises';
const PREFERENCES_KEY = 'saroja_preferences';

/**
 * Save a promise made to/by family member
 */
export function savePromise(promise: Promise): void {
  try {
    const existing = getAllPromises();
    existing.push(promise);
    localStorage.setItem(PROMISES_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save promise:', error);
  }
}

/**
 * Get all promises
 */
export function getAllPromises(): Promise[] {
  try {
    const data = localStorage.getItem(PROMISES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Get unfulfilled promises for a family member
 */
export function getUnfulfilledPromises(familyMemberId: string): Promise[] {
  const all = getAllPromises();
  return all.filter(p => p.familyMemberId === familyMemberId && !p.fulfilled);
}

/**
 * Mark promise as fulfilled
 */
export function fulfillPromise(promiseId: string): void {
  try {
    const all = getAllPromises();
    const promise = all.find(p => p.id === promiseId);
    if (promise) {
      promise.fulfilled = true;
      promise.fulfilledOn = new Date();
      localStorage.setItem(PROMISES_KEY, JSON.stringify(all));
    }
  } catch (error) {
    console.error('Failed to fulfill promise:', error);
  }
}

/**
 * Save a learned preference
 */
export function savePreference(preference: Preference): void {
  try {
    const existing = getAllPreferences();
    existing.push(preference);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save preference:', error);
  }
}

/**
 * Get all preferences
 */
export function getAllPreferences(): Preference[] {
  try {
    const data = localStorage.getItem(PREFERENCES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Get preferences for a family member
 */
export function getPreferencesByMember(familyMemberId: string): Preference[] {
  const all = getAllPreferences();
  return all.filter(p => p.familyMemberId === familyMemberId);
}

/**
 * Get conversations from a specific date range
 */
export function getConversationsByDateRange(
  familyMemberId: string,
  startDate: Date,
  endDate: Date
): StoredConversation[] {
  const all = getConversationsByMember(familyMemberId);
  return all.filter(c => {
    const date = new Date(c.lastUpdated);
    return date >= startDate && date <= endDate;
  });
}

/**
 * Search conversations by keyword
 */
export function searchConversations(familyMemberId: string, keyword: string): StoredConversation[] {
  const all = getConversationsByMember(familyMemberId);
  const lowerKeyword = keyword.toLowerCase();

  return all.filter(c => {
    // Search in messages
    const hasKeywordInMessages = c.messages.some(m =>
      m.content.toLowerCase().includes(lowerKeyword)
    );

    // Search in topics
    const hasKeywordInTopics = c.keyTopics.some(t =>
      t.toLowerCase().includes(lowerKeyword)
    );

    return hasKeywordInMessages || hasKeywordInTopics;
  });
}

/**
 * Get conversation statistics
 */
export function getConversationStats(familyMemberId: string): {
  totalConversations: number;
  totalMessages: number;
  emotionalBreakdown: Record<string, number>;
  mostDiscussedTopics: string[];
  averageMessagesPerConversation: number;
} {
  const conversations = getConversationsByMember(familyMemberId);

  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  const emotionalBreakdown: Record<string, number> = {};
  conversations.forEach(c => {
    emotionalBreakdown[c.emotionalState] = (emotionalBreakdown[c.emotionalState] || 0) + 1;
  });

  const topicCounts: Record<string, number> = {};
  conversations.forEach(c => {
    c.keyTopics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });

  const mostDiscussedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  const averageMessagesPerConversation = totalConversations > 0
    ? Math.round(totalMessages / totalConversations)
    : 0;

  return {
    totalConversations,
    totalMessages,
    emotionalBreakdown,
    mostDiscussedTopics,
    averageMessagesPerConversation
  };
}

