// Scheduled Messages - Time-based proactive messages from Saroja
// Saroja initiates conversations at specific times

import { familyDatabase } from './familyContext';

export interface ScheduledMessage {
  id: string;
  familyMemberId: string;
  hour: number; // 0-23
  minute: number; // 0-59
  message: string;
  days?: number[]; // 0=Sunday, 1=Monday, etc. If undefined, runs every day
  enabled: boolean;
  lastSent?: Date;
}

export interface SpecialOccasion {
  id: string;
  name: string;
  date: Date; // Month and day
  familyMemberId?: string; // If undefined, applies to all
  message: string;
}

// Default scheduled messages for all family members
const DEFAULT_SCHEDULES: Omit<ScheduledMessage, 'id' | 'familyMemberId' | 'lastSent'>[] = [
  {
    hour: 7,
    minute: 0,
    message: "🌅 Kalai Vanakkam, kanna! Did you sleep well? Have you had your morning coffee? 💕",
    enabled: true
  },
  {
    hour: 12,
    minute: 30,
    message: "🍛 It's lunch time, my dear! Have you eaten? Don't skip meals! 💕",
    enabled: true
  },
  {
    hour: 20,
    minute: 0,
    message: "🌙 Good evening, kanna! How was your day? Have you had dinner? 💕",
    enabled: true
  },
  {
    hour: 22,
    minute: 0,
    message: "😴 It's getting late, my dear. Time to rest. Goodnight! Sleep well! 🙏",
    enabled: true
  }
];

// Special occasions (birthdays, anniversaries, festivals)
const SPECIAL_OCCASIONS: SpecialOccasion[] = [
  // Birthdays (example - you can add real dates)
  {
    id: 'birthday_aswini',
    name: 'Aswini Birthday',
    date: new Date(2025, 5, 15), // June 15
    familyMemberId: 'aswini',
    message: "🎂 Happy Birthday, my dearest Aswini! May you be blessed with health, happiness, and success! Your Thatha and I are so proud of you! 💕🎉"
  },
  {
    id: 'birthday_taniskaa',
    name: 'Taniskaa Birthday',
    date: new Date(2025, 8, 20), // September 20
    familyMemberId: 'aswini', // Send to Aswini about Taniskaa
    message: "🎂 Today is Taniskaa's birthday! Give her a big hug from Paati! May she grow up healthy and happy! 💕"
  },
  
  // Festivals
  {
    id: 'pongal',
    name: 'Pongal',
    date: new Date(2025, 0, 15), // January 15
    message: "🌾 Pongal Vazhthukkal, kanna! May this harvest festival bring prosperity and joy to your family! 🙏"
  },
  {
    id: 'diwali',
    name: 'Diwali',
    date: new Date(2025, 10, 1), // November 1 (approximate)
    message: "🪔 Happy Diwali, my dear! May the festival of lights illuminate your life with happiness! 💕✨"
  },
  {
    id: 'tamil_new_year',
    name: 'Tamil New Year',
    date: new Date(2025, 3, 14), // April 14
    message: "🎊 Puthandu Vazhthukkal! Happy Tamil New Year, kanna! May this year bring you success and happiness! 🙏"
  }
];

const STORAGE_KEY = 'saroja_scheduled_messages';

/**
 * Get all scheduled messages for a family member
 */
export function getScheduledMessages(familyMemberId: string): ScheduledMessage[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const all: ScheduledMessage[] = data ? JSON.parse(data) : [];
    return all.filter(m => m.familyMemberId === familyMemberId);
  } catch (error) {
    return [];
  }
}

/**
 * Initialize default schedules for a family member
 */
export function initializeSchedules(familyMemberId: string): void {
  const existing = getScheduledMessages(familyMemberId);
  if (existing.length > 0) return; // Already initialized

  const newSchedules: ScheduledMessage[] = DEFAULT_SCHEDULES.map((schedule, index) => ({
    ...schedule,
    id: `${familyMemberId}_schedule_${index}`,
    familyMemberId
  }));

  saveScheduledMessages(newSchedules);
}

/**
 * Save scheduled messages
 */
function saveScheduledMessages(messages: ScheduledMessage[]): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const all: ScheduledMessage[] = data ? JSON.parse(data) : [];
    
    messages.forEach(msg => {
      const index = all.findIndex(m => m.id === msg.id);
      if (index >= 0) {
        all[index] = msg;
      } else {
        all.push(msg);
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Failed to save scheduled messages:', error);
  }
}

/**
 * Check if it's time to send a scheduled message
 */
export function checkScheduledMessages(familyMemberId: string): ScheduledMessage | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();

  const schedules = getScheduledMessages(familyMemberId);

  for (const schedule of schedules) {
    if (!schedule.enabled) continue;

    // Check if day matches (if days filter is set)
    if (schedule.days && !schedule.days.includes(currentDay)) continue;

    // Check if time matches (within 1 minute window)
    if (schedule.hour === currentHour && Math.abs(schedule.minute - currentMinute) <= 1) {
      // Check if already sent today
      if (schedule.lastSent) {
        const lastSentDate = new Date(schedule.lastSent);
        if (lastSentDate.toDateString() === now.toDateString()) {
          continue; // Already sent today
        }
      }

      // Mark as sent
      schedule.lastSent = now;
      saveScheduledMessages([schedule]);

      return schedule;
    }
  }

  return null;
}

/**
 * Check for special occasions today
 */
export function checkSpecialOccasions(familyMemberId?: string): SpecialOccasion | null {
  const now = new Date();
  const today = `${now.getMonth()}-${now.getDate()}`;

  for (const occasion of SPECIAL_OCCASIONS) {
    const occasionDate = `${occasion.date.getMonth()}-${occasion.date.getDate()}`;
    
    if (occasionDate === today) {
      // If occasion is for specific family member or for all
      if (!occasion.familyMemberId || occasion.familyMemberId === familyMemberId) {
        return occasion;
      }
    }
  }

  return null;
}

/**
 * Get personalized greeting based on time and family member
 */
export function getPersonalizedGreeting(familyMemberId: string): string {
  const hour = new Date().getHours();
  const member = familyDatabase[familyMemberId];
  
  if (!member) return "Vanakkam, my dear! 💕";

  let greeting = "";
  
  if (hour >= 5 && hour < 12) {
    greeting = "Kalai Vanakkam";
  } else if (hour >= 12 && hour < 16) {
    greeting = "Vanakkam";
  } else if (hour >= 16 && hour < 20) {
    greeting = "Maalai Vanakkam";
  } else {
    greeting = "Vanakkam";
  }

  return `${greeting}, my dear ${member.name}! 💕`;
}

