class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private hindiVoice: SpeechSynthesisVoice | null = null;
  public isPlaying: boolean = false;
  private onStateChangeCallback: ((speaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural Hindi voice
    const foundHindi =
      voices.find((v) => v.lang === 'hi-IN' || v.lang === 'hi_IN') ||
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.name.toLowerCase().includes('hindi')) ||
      voices[0];
    this.hindiVoice = foundHindi || null;
  }

  public setOnStateChange(cb: (speaking: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      alert('आपके ब्राउज़र में आवाज़ (Text-to-Speech) समर्थित नहीं है।');
      return;
    }

    this.stop();

    // Clean up Hindi text for smooth reading
    const cleanText = text
      .replace(/[।॥]/g, ', ')
      .replace(/["'“”‘’]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.88; // Poetic gentle pace
    utterance.pitch = 0.95; // Warm mellow tone
    utterance.lang = 'hi-IN';

    if (this.hindiVoice) {
      utterance.voice = this.hindiVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }
  }

  public toggle(text: string, onEnd?: () => void) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.speak(text, onEnd);
    }
  }
}

export const speechService = new SpeechService();
