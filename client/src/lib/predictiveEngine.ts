// Predictive Engine - Smart predictions based on patterns and context
// Saroja predicts what you need before you ask

import { getConversationsByMember, getEmotionalMemoriesByMember } from './memorySystem';
import { familyDatabase } from './familyContext';
import { getAllPhases } from './constructionTracker';

export interface Prediction {
  id: string;
  type: 'reminder' | 'suggestion' | 'question' | 'concern';
  priority: 'low' | 'medium' | 'high';
  message: string;
  context: string;
  confidence: number; // 0-100
}

/**
 * Generate predictions for a family member
 */
export function generatePredictions(familyMemberId: string): Prediction[] {
  const predictions: Prediction[] = [];

  // Get family member data
  const member = familyDatabase[familyMemberId];
  if (!member) return predictions;

  // 1. Check for construction-related predictions
  predictions.push(...predictConstructionNeeds(familyMemberId));

  // 2. Check for emotional support needs
  predictions.push(...predictEmotionalNeeds(familyMemberId));

  // 3. Check for family-related predictions
  predictions.push(...predictFamilyNeeds(familyMemberId, member));

  // 4. Check for time-based predictions
  predictions.push(...predictTimeBasedNeeds(familyMemberId));

  // Sort by priority and confidence
  return predictions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.confidence - a.confidence;
  });
}

/**
 * Predict construction-related needs
 */
function predictConstructionNeeds(familyMemberId: string): Prediction[] {
  const predictions: Prediction[] = [];
  const phases = getAllPhases();

  // Check for in-progress phases
  const inProgress = phases.filter(p => p.status === 'in-progress');
  if (inProgress.length > 0) {
    const phase = inProgress[0];
    predictions.push({
      id: `construction_${phase.id}`,
      type: 'question',
      priority: 'medium',
      message: `How is the ${phase.name} coming along, kanna? Is the work progressing smoothly? 🏗️`,
      context: `Construction phase ${phase.name} is ${phase.progress}% complete`,
      confidence: 80
    });
  }

  // Check for budget concerns
  const totalSpent = phases.reduce((sum, p) => sum + p.budget.spent, 0);
  const totalAllocated = phases.reduce((sum, p) => sum + p.budget.allocated, 0);
  const percentageUsed = (totalSpent / totalAllocated) * 100;

  if (percentageUsed > 80) {
    predictions.push({
      id: 'budget_concern',
      type: 'concern',
      priority: 'high',
      message: `Kanna, I notice you've used ${percentageUsed.toFixed(0)}% of the construction budget. Are you managing the expenses well? Your Thatha always said, 'Save for a rainy day!' 💰`,
      context: `Budget usage is high: ${percentageUsed.toFixed(0)}%`,
      confidence: 90
    });
  }

  return predictions;
}

/**
 * Predict emotional support needs
 */
function predictEmotionalNeeds(familyMemberId: string): Prediction[] {
  const predictions: Prediction[] = [];
  const memories = getEmotionalMemoriesByMember(familyMemberId);

  if (memories.length === 0) return predictions;

  // Check recent emotional states
  const recentMemories = memories.slice(-5);
  const negativeStates = recentMemories.filter(m => 
    ['sad', 'worried', 'distressed'].includes(m.emotionalState)
  );

  if (negativeStates.length >= 3) {
    predictions.push({
      id: 'emotional_support',
      type: 'concern',
      priority: 'high',
      message: `My dear, I've noticed you've been going through a difficult time lately. Remember, I'm always here for you. Would you like to talk about it? 💕`,
      context: `Recent emotional states show distress`,
      confidence: 85
    });
  }

  return predictions;
}

/**
 * Predict family-related needs
 */
function predictFamilyNeeds(familyMemberId: string, member: any): Prediction[] {
  const predictions: Prediction[] = [];

  // Special handling for Aswini (in Germany with family)
  if (familyMemberId === 'aswini') {
    predictions.push({
      id: 'family_jyothi',
      type: 'question',
      priority: 'medium',
      message: `How is Jyothi's work going, kanna? Is he managing well with his job? 💼`,
      context: `Jyothi is Aswini's husband`,
      confidence: 70
    });

    predictions.push({
      id: 'family_taniskaa',
      type: 'question',
      priority: 'medium',
      message: `How is little Taniskaa doing in school? Is she making friends? 📚`,
      context: `Taniskaa is Aswini's daughter`,
      confidence: 70
    });
  }

  // Special handling for Lakshmi (going through difficult times)
  if (familyMemberId === 'lakshmi') {
    predictions.push({
      id: 'lakshmi_support',
      type: 'concern',
      priority: 'high',
      message: `My dearest Lakshmi, how are you holding up? I know things are difficult, but you're stronger than you know. I'm always here for you, kanna. 💕`,
      context: `Lakshmi is going through marital problems`,
      confidence: 95
    });
  }

  return predictions;
}

/**
 * Predict time-based needs
 */
function predictTimeBasedNeeds(familyMemberId: string): Prediction[] {
  const predictions: Prediction[] = [];
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();

  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    predictions.push({
      id: 'weekend_greeting',
      type: 'question',
      priority: 'low',
      message: `It's the weekend, kanna! Are you taking some time to rest? Don't work too hard! 🌸`,
      context: `Weekend relaxation reminder`,
      confidence: 60
    });
  }

  // Evening check
  if (hour >= 18 && hour < 21) {
    predictions.push({
      id: 'evening_meal',
      type: 'reminder',
      priority: 'medium',
      message: `Have you had your dinner, my dear? Don't skip meals! 🍛`,
      context: `Evening meal reminder`,
      confidence: 65
    });
  }

  return predictions;
}

/**
 * Get the most important prediction
 */
export function getTopPrediction(familyMemberId: string): Prediction | null {
  const predictions = generatePredictions(familyMemberId);
  return predictions.length > 0 ? predictions[0] : null;
}

/**
 * Check if it's time to send a predictive message
 * (e.g., after 30 minutes of inactivity)
 */
export function shouldSendPredictiveMessage(lastMessageTime: Date): boolean {
  const now = new Date();
  const minutesSinceLastMessage = (now.getTime() - lastMessageTime.getTime()) / (1000 * 60);
  
  // Send predictive message after 30 minutes of inactivity
  return minutesSinceLastMessage >= 30;
}

