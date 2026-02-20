// Voice Service - Text-to-Speech for Saroja AI
// Supports both Web Speech API and ElevenLabs for premium voice

export type VoiceLanguage = 'en-IN' | 'ta-IN' | 'hi-IN';
export type VoiceGender = 'female' | 'male';

interface VoiceSettings {
  rate: number; // 0.1 to 10 (1 is normal)
  pitch: number; // 0 to 2 (1 is normal)
  volume: number; // 0 to 1
}

// Grandmother-like voice settings
const SAROJA_VOICE_SETTINGS: VoiceSettings = {
  rate: 0.85, // Slightly slower, warm pace
  pitch: 1.15, // Slightly higher, feminine
  volume: 1.0
};

class VoiceService {
  private synthesis: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voiceEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  /**
   * Check if voice output is supported
   */
  isSupported(): boolean {
    return this.synthesis !== null;
  }

  /**
   * Get available voices for a specific language
   */
  getVoicesForLanguage(language: VoiceLanguage): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    
    const voices = this.synthesis.getVoices();
    return voices.filter(voice => voice.lang.startsWith(language.split('-')[0]));
  }

  /**
   * Select the best voice for Saroja (female, Indian accent)
   */
  private selectBestVoice(language: VoiceLanguage): SpeechSynthesisVoice | null {
    if (!this.synthesis) return null;

    const voices = this.synthesis.getVoices();
    
    // Priority 1: Female Indian voice for the language
    let voice = voices.find(v => 
      v.lang === language && 
      v.name.toLowerCase().includes('female')
    );

    // Priority 2: Any Indian voice for the language
    if (!voice) {
      voice = voices.find(v => v.lang === language);
    }

    // Priority 3: Any voice starting with the language code
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    }

    // Priority 4: Default voice
    if (!voice && voices.length > 0) {
      voice = voices[0];
    }

    return voice || null;
  }

  /**
   * Speak text with Saroja's voice
   */
  speak(text: string, language: VoiceLanguage = 'en-IN'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis || !this.voiceEnabled) {
        resolve();
        return;
      }

      // Stop any ongoing speech
      this.stop();

      // Clean text for better speech (remove emojis and special chars)
      const cleanText = text.replace(/[🙏💕❤️✨🏠👋😊😄🎉]/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language;
      utterance.rate = SAROJA_VOICE_SETTINGS.rate;
      utterance.pitch = SAROJA_VOICE_SETTINGS.pitch;
      utterance.volume = SAROJA_VOICE_SETTINGS.volume;

      // Select best voice - wait for voices to load
      const loadVoicesAndSpeak = () => {
        const voice = this.selectBestVoice(language);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => {
          this.isSpeaking = true;
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          console.error('Speech synthesis error:', event);

          // Don't reject on "interrupted" or "canceled" errors
          if (event.error === 'interrupted' || event.error === 'canceled') {
            resolve();
          } else {
            reject(event);
          }
        };

        this.currentUtterance = utterance;

        try {
          this.synthesis!.speak(utterance);
        } catch (error) {
          console.error('Failed to speak:', error);
          this.isSpeaking = false;
          this.currentUtterance = null;
          reject(error);
        }
      };

      // Check if voices are loaded
      const voices = this.synthesis.getVoices();
      if (voices.length === 0) {
        // Wait for voices to load
        this.synthesis.onvoiceschanged = () => {
          loadVoicesAndSpeak();
        };

        // Timeout after 2 seconds
        setTimeout(() => {
          if (!this.isSpeaking) {
            loadVoicesAndSpeak();
          }
        }, 2000);
      } else {
        loadVoicesAndSpeak();
      }
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeakingNow(): boolean {
    return this.isSpeaking;
  }

  /**
   * Enable/disable voice output
   */
  setVoiceEnabled(enabled: boolean): void {
    this.voiceEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  /**
   * Get voice enabled status
   */
  isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }
}

// Export singleton instance
export const voiceService = new VoiceService();

