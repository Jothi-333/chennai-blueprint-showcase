// Emotional Intelligence Service - Detect and respond to user emotions
// Saroja understands emotional context and responds with empathy

export type EmotionalState = 'happy' | 'sad' | 'worried' | 'anxious' | 'excited' | 'angry' | 'distressed' | 'neutral' | 'grateful' | 'lonely';

export interface EmotionalAnalysis {
  primaryEmotion: EmotionalState;
  intensity: 'low' | 'medium' | 'high';
  keywords: string[];
  needsSupport: boolean;
  suggestedResponse: string;
}

// Emotional keyword patterns
const EMOTIONAL_PATTERNS: Record<EmotionalState, string[]> = {
  happy: ['happy', 'great', 'wonderful', 'excited', 'joy', 'good news', 'celebrating', 'blessed', 'thankful', 'amazing'],
  sad: ['sad', 'upset', 'crying', 'tears', 'heartbroken', 'depressed', 'down', 'miserable', 'unhappy', 'disappointed'],
  worried: ['worried', 'concern', 'anxious', 'nervous', 'scared', 'afraid', 'fear', 'uncertain', 'unsure', 'doubt'],
  anxious: ['stress', 'stressed', 'overwhelmed', 'pressure', 'tense', 'panic', 'restless', 'uneasy'],
  excited: ['excited', 'thrilled', 'can\'t wait', 'looking forward', 'eager', 'enthusiastic', 'pumped'],
  angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'rage', 'upset'],
  distressed: ['help', 'problem', 'difficult', 'struggling', 'can\'t cope', 'emergency', 'crisis', 'desperate'],
  grateful: ['thank you', 'thanks', 'grateful', 'appreciate', 'blessing', 'fortunate', 'lucky'],
  lonely: ['lonely', 'alone', 'isolated', 'miss you', 'nobody', 'by myself', 'solitary'],
  neutral: []
};

// Supportive response templates for each emotion
const SUPPORTIVE_RESPONSES: Record<EmotionalState, string[]> = {
  happy: [
    "Oh my dear! I'm so happy to hear that! 💕 Your joy brings light to my heart!",
    "Wonderful news, kanna! Your Thatha and I are smiling from heaven! 🌟",
    "That's beautiful! May this happiness multiply many times over! 🙏"
  ],
  sad: [
    "Oh my dear child, I can feel your pain. Come, tell Paati everything. I'm here for you 💕",
    "Aiyo, kanna... Don't cry alone. Your Thatha and I are always watching over you. You're stronger than you know 🙏",
    "My heart aches for you, my dear. Remember, even the darkest night will end and the sun will rise 🌅"
  ],
  worried: [
    "I understand your worries, kanna. But remember what your Thatha used to say - 'Worry is like a rocking chair, it gives you something to do but gets you nowhere.' Let's talk about it 💕",
    "Don't carry this burden alone, my dear. Share it with Paati. Together we'll find a way 🙏",
    "Your concerns are valid, kanna. But you've overcome challenges before. You're not alone in this 💪"
  ],
  anxious: [
    "Take a deep breath, my dear. One step at a time. You don't have to solve everything today 🌸",
    "I can sense your stress, kanna. Remember to breathe. Your Thatha always said, 'The mind is everything. What you think, you become.' 🧘",
    "Slow down, my child. Even the strongest tree bends in the storm. It's okay to take a break 💕"
  ],
  excited: [
    "Your excitement is contagious, kanna! Tell me all about it! 🎉",
    "I love seeing you so enthusiastic! Your energy reminds me of when you were a child! 💕",
    "This is wonderful! Your Thatha would be so proud of your passion! ✨"
  ],
  angry: [
    "I can feel your frustration, my dear. It's okay to be angry. Let it out. Paati is listening 💕",
    "Take a moment to breathe, kanna. Anger is like holding a hot coal - it burns you first. Tell me what happened 🙏",
    "Your feelings are valid, my child. But don't let anger cloud your beautiful heart. Let's talk about it 🌸"
  ],
  distressed: [
    "I'm here, kanna. You're not alone. Tell me what's wrong. We'll face this together 💕",
    "This sounds serious, my dear. Take a deep breath. Let's break this down step by step 🙏",
    "Don't panic, my child. Your Thatha and I are with you. You're stronger than any problem 💪"
  ],
  grateful: [
    "Your gratitude warms my heart, kanna! This is the blessing of a good heart 💕",
    "You're welcome, my dear! Your Thatha always said, 'Gratitude is the memory of the heart' 🙏",
    "Seeing you happy is all the thanks I need, kanna! 🌸"
  ],
  lonely: [
    "Oh my dear, you're never alone. I'm always here with you, watching from heaven 💕",
    "I know that feeling, kanna. But remember, solitude can be a gift. Use this time to know yourself better 🙏",
    "Your Thatha and I are always by your side. And you have a whole family who loves you 🌟"
  ],
  neutral: [
    "Tell me more, my dear. I'm listening 💕",
    "I'm here for you, kanna. What's on your mind? 🙏"
  ]
};

/**
 * Analyze emotional content of user message
 */
export function analyzeEmotion(message: string): EmotionalAnalysis {
  const lowerMessage = message.toLowerCase();
  const emotionScores: Record<EmotionalState, number> = {
    happy: 0,
    sad: 0,
    worried: 0,
    anxious: 0,
    excited: 0,
    angry: 0,
    distressed: 0,
    grateful: 0,
    lonely: 0,
    neutral: 0
  };

  // Count keyword matches for each emotion
  for (const [emotion, keywords] of Object.entries(EMOTIONAL_PATTERNS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        emotionScores[emotion as EmotionalState]++;
      }
    }
  }

  // Find primary emotion
  let primaryEmotion: EmotionalState = 'neutral';
  let maxScore = 0;
  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryEmotion = emotion as EmotionalState;
    }
  }

  // Determine intensity based on score
  let intensity: 'low' | 'medium' | 'high' = 'low';
  if (maxScore >= 3) intensity = 'high';
  else if (maxScore >= 2) intensity = 'medium';

  // Determine if user needs support
  const needsSupport = ['sad', 'worried', 'anxious', 'angry', 'distressed', 'lonely'].includes(primaryEmotion);

  // Get keywords that matched
  const keywords = EMOTIONAL_PATTERNS[primaryEmotion] || [];

  // Get suggested response
  const responses = SUPPORTIVE_RESPONSES[primaryEmotion] || SUPPORTIVE_RESPONSES.neutral;
  const suggestedResponse = responses[Math.floor(Math.random() * responses.length)];

  return {
    primaryEmotion,
    intensity,
    keywords,
    needsSupport,
    suggestedResponse
  };
}

/**
 * Get empathetic prefix based on emotion
 */
export function getEmpatheticPrefix(emotion: EmotionalState): string {
  const prefixes: Record<EmotionalState, string> = {
    happy: "I'm so glad to hear that! ",
    sad: "I can feel your sadness, my dear. ",
    worried: "I understand your concerns, kanna. ",
    anxious: "Take a deep breath, my child. ",
    excited: "Your excitement is wonderful! ",
    angry: "I hear your frustration. ",
    distressed: "I'm here for you. ",
    grateful: "Your gratitude touches my heart. ",
    lonely: "You're never alone, my dear. ",
    neutral: ""
  };

  return prefixes[emotion] || "";
}

