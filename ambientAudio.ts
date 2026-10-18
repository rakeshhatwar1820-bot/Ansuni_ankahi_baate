class AmbientSoundService {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private timerId: any = null;
  private noiseNode: AudioNode | null = null;

  public isEnabled(): boolean {
    return this.isRunning;
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create gentle soothing rain filter
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      whiteNoise.start(0);
      this.noiseNode = whiteNoise;

      // Gentle acoustic bell / sitar drone chords every 4-7 seconds
      const notes = [220, 246.94, 277.18, 329.63, 369.99, 440, 493.88]; // Pentatonic romantic scale
      const playChime = () => {
        if (!this.ctx || !this.isRunning || !this.masterGain) return;
        const note = notes[Math.floor(Math.random() * notes.length)];
        const osc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);

        chimeGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.03, this.ctx.currentTime + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

        osc.connect(chimeGain);
        chimeGain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 3.8);

        const nextDelay = 3500 + Math.random() * 4000;
        this.timerId = setTimeout(playChime, nextDelay);
      };

      this.isRunning = true;
      playChime();
    } catch (err) {
      console.warn('Ambient audio error', err);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {
        // ignore
      }
      this.ctx = null;
    }
  }
}

export const ambientSoundService = new AmbientSoundService();
