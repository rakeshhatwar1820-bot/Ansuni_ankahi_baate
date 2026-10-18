import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  Share2,
  Palette,
  Check,
  Type,
  Sun,
  Moon,
  Clock,
  Eye,
  MessageCircle
} from 'lucide-react';
import { PoetryItem } from '../types/poetry';
import { CATEGORY_LABELS } from '../data/defaultPoetry';
import { speechService } from '../services/audioSpeech';
import { incrementViewCount } from '../services/storage';

interface PoetryDetailModalProps {
  item: PoetryItem | null;
  onClose: () => void;
  isLiked: boolean;
  isFavorite: boolean;
  onToggleLike: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenCardGenerator: (item: PoetryItem) => void;
}

export const PoetryDetailModal: React.FC<PoetryDetailModalProps> = ({
  item,
  onClose,
  isLiked,
  isFavorite,
  onToggleLike,
  onToggleFavorite,
  onOpenCardGenerator,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSize, setFontSize] = useState<number>(20); // 16, 20, 24
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'candlelight'>('dark');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item) {
      incrementViewCount(item.id);
    }
    return () => {
      speechService.stop();
      setIsPlayingAudio(false);
    };
  }, [item?.id]);

  const handleToggleVoice = () => {
    if (!item) return;
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      speechService.speak(item.content, () => {
        setIsPlayingAudio(false);
      });
      setIsPlayingAudio(true);
    }
  };

  const handleShare = async () => {
    if (!item) return;
    const shareText = `*${item.title}*\n\n${item.content}\n\n— *${item.author}*\n\n✨ 'अनसुनी अनकही बातें' पर पूरा पढ़ें: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
        });
      } catch (err) {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (!item) return;
    const shareText = encodeURIComponent(
      `*${item.title}*\n\n${item.content}\n\n— *${item.author}*\n\n✨ पढ़िए 'अनसुनी अनकही बातें' पर: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  if (!item) return null;

  const themeClasses = {
    dark: 'bg-stone-950 text-stone-100 border-rose-950/70',
    sepia: 'bg-[#211915] text-[#ecd8c6] border-[#453123]',
    candlelight: 'bg-[#18090d] text-[#fae1dd] border-[#5a1b26]',
  }[readingTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-300 my-auto ${themeClasses}`}
      >
        {/* Top Floating Control Bar */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-inherit/90 backdrop-blur-md border-b border-inherit flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/50">
              {CATEGORY_LABELS[item.category]?.hi || item.category}
            </span>
            <span className="text-xs text-stone-400 hidden sm:inline">
              {item.subcategory}
            </span>
          </div>

          {/* Reader Preferences & Close */}
          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <div className="flex items-center bg-stone-900/60 rounded-full p-0.5 border border-stone-800 text-xs">
              <button
                onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                className="px-2 py-1 text-stone-400 hover:text-white"
                title="अक्षर छोटे करें"
              >
                A-
              </button>
              <span className="text-[11px] text-stone-500 px-1">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                className="px-2 py-1 text-stone-400 hover:text-white"
                title="अक्षर बड़े करें"
              >
                A+
              </button>
            </div>

            {/* Reading theme */}
            <button
              onClick={() => {
                if (readingTheme === 'dark') setReadingTheme('candlelight');
                else if (readingTheme === 'candlelight') setReadingTheme('sepia');
                else setReadingTheme('dark');
              }}
              className="p-2 rounded-full bg-stone-900/60 border border-stone-800 text-stone-300 hover:text-amber-300"
              title="पठन रंग बदलें (Night / Candlelight / Sepia)"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-900/70 hover:bg-rose-950 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto">
          {/* Post Title */}
          <h2 className="font-hindi-serif text-2xl sm:text-4xl font-bold text-rose-100 mb-3 leading-snug">
            {item.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 mb-8 pb-4 border-b border-stone-800/60">
            <div className="flex items-center gap-1.5 font-hindi-hand text-sm text-rose-300 font-bold">
              <span>✍️ कलम से:</span>
              <span>{item.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.readingTimeMinutes || 2} मिनट का पठन</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{item.views || 1} बार पढ़ा गया</span>
            </div>
          </div>

          {/* Full Poetry/Story Content */}
          <div
            style={{ fontSize: `${fontSize}px` }}
            className="font-hindi-body leading-loose sm:leading-loose whitespace-pre-line tracking-wide mb-10 select-text"
          >
            {item.content}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-800/60 mb-6">
              {item.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-rose-950/50 text-rose-300 border border-rose-900/50"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="px-6 py-4 bg-inherit/95 border-t border-inherit flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Audio Recite */}
            <button
              onClick={handleToggleVoice}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-950/80 text-rose-200 border border-rose-700/60 hover:bg-rose-900'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>आवाज़ रोकें</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-rose-400" />
                  <span>आवाज़ में सुनें</span>
                </>
              )}
            </button>

            {/* Like */}
            <button
              onClick={() => onToggleLike(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm border transition-all ${
                isLiked
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
              <span>{item.likes}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`p-2 rounded-full border transition-all ${
                isFavorite
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-amber-400'
              }`}
              title="पसंदीदा"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Generate Quote Card */}
            <button
              onClick={() => {
                onClose();
                onOpenCardGenerator(item);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium bg-amber-950/80 text-amber-200 border border-amber-600/50 hover:bg-amber-900 transition-all"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>फ़ोटो बनाएं</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium bg-emerald-950/80 text-emerald-200 border border-emerald-600/50 hover:bg-emerald-900 transition-all"
              title="व्हाट्सऐप पर भेजें"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">व्हाट्सऐप</span>
            </button>

            {/* Copy / Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
              title="शेयर करें"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
