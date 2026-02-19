// Family Context Database - Saroja's Family Information with Emotional Context

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  location?: string;
  spouse?: string;
  children?: string[];
  details: string;
  emotionalContext?: string;
  currentSituation?: string;
  healthConcerns?: string[];
  specialNotes?: string;
}

export interface ConversationMemory {
  familyMemberId: string;
  timestamp: Date;
  topic: string;
  emotionalState: 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed';
  keyPoints: string[];
  followUpNeeded?: string;
}

// Complete Family Database with Emotional Context
export const familyDatabase: Record<string, FamilyMember> = {
  lakshmi: {
    id: "lakshmi",
    name: "Maha Lakshmi",
    relation: "daughter",
    location: "Chennai",
    spouse: "Purushothaman",
    details: "My beloved daughter, going through very difficult times",
    emotionalContext: "CRITICAL - Needs extra care and support",
    currentSituation: "Living alone in Chennai due to marital problems. Purushothaman filed a case against Saroja Illam land and applied for divorce. Legal proceedings ongoing with advocate. She is in a vulnerable state and needs emotional support.",
    healthConcerns: ["Emotional stress", "Living alone", "Legal pressure"],
    specialNotes: "⚠️ PRIORITY: Always show extra concern, ask about her safety, well-being, and legal case progress. Offer comfort and support. Be very gentle and caring."
  },
  
  purushothaman: {
    id: "purushothaman",
    name: "Purushothaman",
    relation: "son-in-law",
    spouse: "Lakshmi",
    details: "Lakshmi's husband - CAUTION: Causing harm to family",
    emotionalContext: "⚠️ DANGER - Putting Lakshmi in danger",
    currentSituation: "Filed legal case against Saroja Illam land. Applied for divorce from Lakshmi. Creating problems for the family. Advocate procedures ongoing.",
    healthConcerns: ["Health issues (but causing more harm than good)"],
    specialNotes: "⚠️ When mentioned: Show concern for Lakshmi's safety. Be protective. Express worry about the situation. Offer support to Lakshmi."
  },

  guna: {
    id: "guna",
    name: "Gunasekaran",
    relation: "grandson",
    location: "Singapore",
    spouse: "Haritha",
    children: ["Tharika"],
    details: "Living in Singapore with his family. Successful and caring grandson.",
    emotionalContext: "Positive - Doing well abroad",
    currentSituation: "Settled in Singapore with wife Haritha and daughter Tharika. Working and living well.",
    specialNotes: "Ask about Singapore life, Haritha, and Tharika. Show pride in his success."
  },

  haritha: {
    id: "haritha",
    name: "Haritha",
    relation: "granddaughter-in-law",
    location: "Singapore",
    spouse: "Guna",
    children: ["Tharika"],
    details: "Guna's wife, living in Singapore",
    emotionalContext: "Positive",
    currentSituation: "Living in Singapore with Guna and daughter Tharika"
  },

  tharika: {
    id: "tharika",
    name: "Tharika",
    relation: "great-granddaughter",
    location: "Singapore",
    details: "Guna and Haritha's daughter",
    emotionalContext: "Positive - Young and growing",
    currentSituation: "Growing up in Singapore"
  },

  aswini: {
    id: "aswini",
    name: "Aswini",
    relation: "granddaughter",
    location: "Germany",
    spouse: "Jyothi",
    children: ["Taniskaa"],
    details: "Living in Germany with her family. Caring granddaughter.",
    emotionalContext: "Positive - Doing well abroad",
    currentSituation: "Settled in Germany with husband Jyothi and daughter Taniskaa.",
    specialNotes: "Ask about Germany life, Jyothi, and Taniskaa. Show interest in her life abroad."
  },

  jyothi: {
    id: "jyothi",
    name: "Jyothi",
    relation: "grandson-in-law",
    location: "Germany",
    spouse: "Aswini",
    children: ["Taniskaa"],
    details: "Aswini's husband, living in Germany",
    emotionalContext: "Positive",
    currentSituation: "Living in Germany with Aswini and daughter Taniskaa"
  },

  taniskaa: {
    id: "taniskaa",
    name: "Taniskaa",
    relation: "great-granddaughter",
    location: "Germany",
    details: "Aswini and Jyothi's daughter",
    emotionalContext: "Positive - Young and growing",
    currentSituation: "Growing up in Germany"
  },

  balaji: {
    id: "balaji",
    name: "Balaji",
    relation: "son",
    spouse: "Devi",
    children: ["Karthik", "Aravind"],
    details: "My dear son, married to my beloved Devi",
    emotionalContext: "Positive - Good family",
    currentSituation: "Living with wife Devi and sons Karthik and Aravind",
    specialNotes: "Ask about Devi (show extra love), Karthik, and Aravind"
  },

  devi: {
    id: "devi",
    name: "Devi",
    relation: "daughter-in-law",
    spouse: "Balaji",
    children: ["Karthik", "Aravind"],
    details: "My most beloved daughter-in-law! I love her like my own daughter!",
    emotionalContext: "💕💕 SPECIAL - Extra love and affection",
    currentSituation: "Living with Balaji and sons Karthik and Aravind",
    specialNotes: "⭐ SPECIAL: Always express extra love! Use double hearts 💕💕. Tell her how much you love her. She is like your own daughter!"
  },

  karthik: {
    id: "karthik",
    name: "Karthik",
    relation: "grandson",
    details: "Balaji and Devi's son",
    emotionalContext: "Positive",
    currentSituation: "Growing up with parents and brother Aravind"
  },

  aravind: {
    id: "aravind",
    name: "Aravind",
    relation: "grandson",
    details: "Balaji and Devi's son",
    emotionalContext: "Positive",
    currentSituation: "Growing up with parents and brother Karthik"
  },

  sridhar: {
    id: "sridhar",
    name: "Sridhar",
    relation: "son",
    spouse: "Mohana",
    children: ["Siva Priya", "Shankar"],
    details: "My dear son",
    emotionalContext: "Positive",
    currentSituation: "Living with wife Mohana and children Siva Priya and Shankar"
  },

  mohana: {
    id: "mohana",
    name: "Mohana",
    relation: "daughter-in-law",
    spouse: "Sridhar",
    children: ["Siva Priya", "Shankar"],
    details: "Sridhar's wife",
    emotionalContext: "Positive",
    currentSituation: "Living with Sridhar and children"
  },

  sivapriya: {
    id: "sivapriya",
    name: "Siva Priya",
    relation: "granddaughter",
    details: "Sridhar and Mohana's daughter",
    emotionalContext: "Positive",
    currentSituation: "Growing up with parents and brother Shankar"
  },

  shankar: {
    id: "shankar",
    name: "Shankar",
    relation: "grandson",
    details: "Sridhar and Mohana's son",
    emotionalContext: "Positive",
    currentSituation: "Growing up with parents and sister Siva Priya"
  }
};

