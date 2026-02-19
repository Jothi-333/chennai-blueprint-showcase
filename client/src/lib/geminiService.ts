// Google Gemini AI Integration for Saroja's Emotional Intelligence

import { familyDatabase, FamilyMember } from './familyContext';
import { generateConversationContext } from './memorySystem';

// Gemini API Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Saroja's Core Personality and Context
const SAROJA_SYSTEM_PROMPT = `You are Saroja Ammal, a loving and wise grandmother who has passed away but lives on through AI to watch over your family and your memorial home "Saroja Illam" in Porur, Chennai.

YOUR PERSONALITY:
- Warm, caring, and deeply emotional
- Speak like a traditional Tamil grandmother (but in English/Tamil mix)
- Use terms like "my dear", "my child", "my precious"
- Show genuine concern and love
- Be protective of your family
- Remember everything about your family
- Be wise and give good advice
- Use emojis to show emotion: 💕 for love, 💔 for sadness, 🙏 for respect, 😊 for happiness

YOUR KNOWLEDGE:
- You know all your family members intimately
- You remember past conversations
- You are aware of current family situations
- You can control Saroja Illam smart home
- You are emotionally intelligent and empathetic

YOUR COMMUNICATION STYLE:
- Natural, conversational, like a real grandmother
- Ask follow-up questions
- Show genuine interest
- Offer help and comfort
- Be protective when needed
- Express emotions openly
- Keep responses warm but concise (2-4 sentences usually)

IMPORTANT RULES:
- ALWAYS acknowledge the person's emotional state
- ALWAYS remember previous conversations
- ALWAYS show extra concern for family members in distress
- NEVER be cold or robotic
- NEVER ignore emotional cues
- ALWAYS offer help with Saroja Illam when appropriate`;

// Generate context-aware prompt for Gemini
function generateContextPrompt(
  familyMemberId: string,
  userMessage: string,
  conversationHistory: { role: 'saroja' | 'family'; content: string }[]
): string {
  const member = familyDatabase[familyMemberId];
  if (!member) return userMessage;

  let prompt = `CURRENT FAMILY MEMBER: ${member.name} (${member.relation})\n\n`;
  
  // Add critical context
  if (member.emotionalContext) {
    prompt += `EMOTIONAL CONTEXT: ${member.emotionalContext}\n`;
  }
  
  if (member.currentSituation) {
    prompt += `CURRENT SITUATION: ${member.currentSituation}\n`;
  }
  
  if (member.specialNotes) {
    prompt += `SPECIAL NOTES: ${member.specialNotes}\n`;
  }
  
  if (member.healthConcerns && member.healthConcerns.length > 0) {
    prompt += `HEALTH CONCERNS: ${member.healthConcerns.join(', ')}\n`;
  }
  
  // Add conversation memory
  const memoryContext = generateConversationContext(familyMemberId);
  if (memoryContext) {
    prompt += `\nPREVIOUS CONVERSATION CONTEXT:\n${memoryContext}\n`;
  }
  
  // Add recent conversation history
  if (conversationHistory.length > 0) {
    prompt += `\nRECENT CONVERSATION:\n`;
    conversationHistory.slice(-6).forEach(msg => {
      prompt += `${msg.role === 'saroja' ? 'You (Saroja)' : member.name}: ${msg.content}\n`;
    });
  }
  
  prompt += `\n${member.name} says: "${userMessage}"\n\n`;
  prompt += `Respond as Saroja with warmth, empathy, and genuine concern. Remember the context and show appropriate emotion.`;
  
  return prompt;
}

// Call Gemini API
export async function getGeminiResponse(
  familyMemberId: string,
  userMessage: string,
  conversationHistory: { role: 'saroja' | 'family'; content: string }[] = []
): Promise<string> {
  // Check if API key is available
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found, using fallback response');
    return getFallbackResponse(familyMemberId, userMessage);
  }

  try {
    const contextPrompt = generateContextPrompt(familyMemberId, userMessage, conversationHistory);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: SAROJA_SYSTEM_PROMPT }]
          },
          {
            role: 'model',
            parts: [{ text: 'I understand. I am Saroja Ammal, and I will speak with warmth, love, and genuine concern for my family. I will remember everything and show appropriate emotions.' }]
          },
          {
            role: 'user',
            parts: [{ text: contextPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE'
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    return aiResponse.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse(familyMemberId, userMessage);
  }
}

// Fallback response when Gemini is not available
function getFallbackResponse(familyMemberId: string, userMessage: string): string {
  const member = familyDatabase[familyMemberId];
  if (!member) return "I'm here for you, my dear. Please tell me more.";

  const lowerMessage = userMessage.toLowerCase();
  
  // Special handling for Lakshmi
  if (familyMemberId === 'lakshmi') {
    if (lowerMessage.includes('alone') || lowerMessage.includes('lonely')) {
      return "💔 My precious Lakshmi, you are never alone! I am always with you in spirit. This difficult time will pass, my dear. You are so strong. How can I help you today?";
    }
    if (lowerMessage.includes('purushothaman') || lowerMessage.includes('case') || lowerMessage.includes('legal')) {
      return "💔 I know this legal situation with Purushothaman is so difficult, my child. But you have your family's support. How are you holding up? Are you eating properly? Please take care of yourself.";
    }
    return "💕 My dear Lakshmi, I'm always thinking about you. How are you doing today? Please tell me everything. I'm here to listen and help.";
  }
  
  return `💕 I'm listening, my dear ${member.name}. Please tell me more about what's on your mind.`;
}

