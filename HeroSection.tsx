import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  Heart,
  Palette,
  Quote,
  Feather,
  Flame,
  Coffee,
  Check
} from 'lucide-react';
import { PoetryItem } from '../types/poetry';
import { CATEGORY_LABELS, MOOD_TAGS } from '../data/defaultPoetry';
import { speechService } from '../services/audioSpeech';

interface HeroSectionProps {
  featuredItem: PoetryItem | null;
  onLike: (id: string) => void;
  isLiked: boolean;
  onOpenCardModal: (item: PoetryItem) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeMood: string;
  onSelectMood: (mood: string) => void;
  categoryCounts: Record<string, number>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredItem,
  onLike,
  isLiked,
  onOpenCardModal,
  activeCategory,
  onSelectCategory,
  activeMood,
  onSelectMood,
  categoryCounts,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleVoice = () => {
    if (!featuredItem) return;
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      speechService.speak(featuredItem.content, () => {
        setIsPlayingAudio(false);
      });
      setIsPlayingAudio(true);
    }
  };

  const handleShare = async () => {
    if (!featuredItem) return;
    const shareText = `*${featuredItem.title}*\n\n${featuredItem.content}\n\n— *${featuredItem.author}*\n\n✨ पढ़िए और सुनिए 'अनसुनी अनकही बातें' पर: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: featuredItem.title,
          text: shareText,
        });
      } catch (err) {
        // Fallback
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-stone-950 via-rose-950/20 to-stone-950">
      {/* Romantic glow & backdrop patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-rose-900/15 via-rose-950/5 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Decorative rose petals floating */}
      <div className="absolute top-12 left-10 text-rose-500/15 text-4xl animate-float-slow select-none pointer-events-none hidden lg:block">
        🥀
      </div>
      <div className="absolute top-24 right-12 text-rose-400/15 text-5xl animate-float-slow select-none pointer-events-none hidden lg:block" style={{ animationDelay: '2s' }}>
        🌹
      </div>
      <div className="absolute bottom-6 left-1/4 text-amber-500/10 text-3xl animate-float-slow select-none pointer-events-none hidden sm:block" style={{ animationDelay: '4s' }}>
        ✨
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Title Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/70 border border-rose-600/30 text-rose-300 text-xs sm:text-sm font-hindi-body mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>अनकहे अहसास, जो छू लें आपकी रूह को</span>
          <span className="text-amber-400/80">•</span>
          <span className="text-amber-300 font-hindi-hand">Ansuni Ankahi Bate</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-hindi-serif font-bold tracking-tight text-stone-100 mb-4 leading-tight sm:leading-snug">
          दिल से निकले लफ़्ज़,{' '}
          <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            जो बन गए दास्तान
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-400 font-hindi-body mb-8 leading-relaxed">
          शायरी, ग़ज़ल, कविता और दिल को छू जाने वाली प्रेम कहानियों का एक ख़ास आशियाना।
          पढ़िए, सुनिए और खूबसूरत स्टेटस कार्ड्स बनाकर अपनों के साथ साझा कीजिए।
        </p>

        {/* Featured Card: "आज का चुनिंदा शेर / Sher of the Day" */}
        {featuredItem && (
          <div className="relative max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-stone-900/90 via-rose-950/40 to-stone-900/90 border border-rose-500/30 shadow-2xl shadow-rose-950/40 text-left backdrop-blur-sm group hover:border-rose-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-900/60 text-rose-300 border border-rose-700/50">
                  <Flame className="w-4 h-4 text-amber-400" />
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-300/90">
                  आज का ख़ास शेर / Featured
                </span>
              </div>
              <span className="text-xs text-amber-300/80 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-600/30">
                {featuredItem.subcategory}
              </span>
            </div>

            {/* Poetic quote lines */}
            <div className="relative my-4 pl-4 sm:pl-6 border-l-2 border-rose-500/50">
              <Quote className="absolute -top-3 -left-3.5 w-6 h-6 text-rose-500/40 rotate-180" />
              <p className="font-hindi-serif text-lg sm:text-2xl text-rose-50 leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide">
                {featuredItem.content}
              </p>
            </div>

            {/* Author info & Actions */}
            <div className="mt-6 pt-4 border-t border-rose-900/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-900/80 border border-rose-600/40 flex items-center justify-center text-xs font-bold text-rose-200">
                  ✍️
                </div>
                <div>
                  <div className="text-sm font-hindi-hand font-bold text-rose-200">
                    {featuredItem.author}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {featuredItem.likes} लोगों को पसंद आया
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Voice button */}
                <button
                  onClick={handleToggleVoice}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-rose-950/80 text-rose-200 border border-rose-700/50 hover:bg-rose-900'
                  }`}
                  title="शेर को आवाज़ में सुनिए"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>रोकें</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>सुनिए</span>
                    </>
                  )}
                </button>

                {/* Make Quote Card */}
                <button
                  onClick={() => onOpenCardModal(featuredItem)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-950/80 text-amber-200 border border-amber-600/50 hover:bg-amber-900 transition-all shadow-sm"
                  title="इंस्टाग्राम / व्हाट्सऐप स्टेटस फोटो बनाएं"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">फ़ोटो बनाएं</span>
                  <span className="sm:hidden">कार्ड</span>
                </button>

                {/* Like Button */}
                <button
                  onClick={() => onLike(featuredItem.id)}
                  className={`p-2 rounded-full border transition-all ${
                    isLiked
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : 'bg-stone-900/80 border-rose-900/50 text-stone-400 hover:text-rose-400'
                  }`}
                  title={isLiked ? 'पसंद हटाया' : 'पसंद करें'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-stone-900/80 border border-rose-900/50 text-stone-400 hover:text-rose-200 transition-all"
                  title="शेयर करें"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Pills Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => {
            const active = activeCategory === catKey;
            const count = categoryCounts[catKey] ?? 0;
            return (
              <button
                key={catKey}
                onClick={() => onSelectCategory(catKey)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-hindi-body transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-rose-800 to-rose-950 text-white font-semibold shadow-lg shadow-rose-950/60 border border-rose-500/50 scale-105'
                    : 'bg-stone-900/70 text-stone-300 hover:bg-rose-950/40 hover:text-rose-200 border border-stone-800/80'
                }`}
              >
                <span>{info.hi}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-rose-950/90 text-rose-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mood Filter Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-xs text-stone-500 font-hindi-body mr-1">मिजाज़ (Mood):</span>
          {MOOD_TAGS.map((m) => {
            const active = activeMood === m.key;
            return (
              <button
                key={m.key}
                onClick={() => onSelectMood(m.key)}
                className={`text-xs px-2.5 py-1 rounded-full transition-all font-hindi-body ${
                  active
                    ? 'bg-rose-900/80 text-rose-100 border border-rose-600/60 font-medium'
                    : 'bg-stone-900/40 text-stone-400 hover:text-stone-200 border border-stone-800/50'
                }`}
              >
                <span className="mr-1">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
