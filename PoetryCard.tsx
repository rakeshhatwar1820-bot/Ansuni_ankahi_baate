import React, { useState } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Palette,
  Clock,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { PoetryItem } from '../types/poetry';
import { CATEGORY_LABELS } from '../data/defaultPoetry';
import { speechService } from '../services/audioSpeech';

interface PoetryCardProps {
  item: PoetryItem;
  isLiked: boolean;
  isFavorite: boolean;
  onToggleLike: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenCardGenerator: (item: PoetryItem) => void;
  onOpenDetail: (item: PoetryItem) => void;
}

export const PoetryCard: React.FC<PoetryCardProps> = ({
  item,
  isLiked,
  isFavorite,
  onToggleLike,
  onToggleFavorite,
  onOpenCardGenerator,
  onOpenDetail,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `*${item.title}*\n\n${item.content}\n\n— *${item.author}*\n\n✨ पढ़िए और सुनिए 'अनसुनी अनकही बातें' पर: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isStory = item.category === 'story';
  const lines = item.content.split('\n').filter((l) => l.trim().length > 0);
  const isLong = lines.length > 8 || item.content.length > 280;

  // For preview card, if it's very long, show initial excerpt with "पूरा पढ़ें"
  const previewContent = isLong
    ? lines.slice(0, 6).join('\n') + '\n...'
    : item.content;

  const categoryLabel = CATEGORY_LABELS[item.category]?.hi || item.category;

  return (
    <article
      onClick={() => onOpenDetail(item)}
      className="group relative rounded-3xl bg-gradient-to-br from-stone-900/90 via-stone-900/70 to-rose-950/20 border border-stone-800/80 hover:border-rose-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/30 hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40">
              {categoryLabel}
            </span>
            <span className="text-xs text-stone-400 font-hindi-body">
              {item.subcategory}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <Clock className="w-3 h-3" />
            <span>{item.readingTimeMinutes || 1} मि.</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-hindi-serif text-xl sm:text-2xl font-bold text-stone-100 group-hover:text-rose-200 transition-colors mb-4 leading-snug">
          {item.title}
        </h3>

        {/* Content Box */}
        <div className="relative font-hindi-body text-base text-stone-300 whitespace-pre-line leading-relaxed mb-4 pl-3.5 border-l-2 border-rose-900/50 group-hover:border-rose-500/60 transition-colors">
          {previewContent}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-900 text-stone-400 border border-stone-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Author & Actions */}
      <div className="pt-4 border-t border-stone-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-rose-300/80 font-hindi-hand font-bold">
            कलम से: {item.author}
          </div>

          {isLong && (
            <div className="text-xs text-rose-400 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>{isStory ? 'पूरी कहानी पढ़ें' : 'पूरा पढ़ें'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-1 pt-1">
          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(item.id);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
              isLiked
                ? 'bg-rose-950 text-rose-300 border border-rose-600/50'
                : 'text-stone-400 hover:text-rose-300 hover:bg-stone-800/60'
            }`}
            title="पसंद करें"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{item.likes}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`p-1.5 rounded-full transition-all ${
              isFavorite
                ? 'bg-amber-950/70 text-amber-300 border border-amber-600/50'
                : 'text-stone-400 hover:text-amber-300 hover:bg-stone-800/60'
            }`}
            title={isFavorite ? 'पसंदीदा से हटाएं' : 'पसंदीदा में जोड़ें'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {/* Audio Recite */}
          <button
            onClick={handleToggleVoice}
            className={`p-1.5 rounded-full transition-all ${
              isPlayingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-stone-400 hover:text-rose-300 hover:bg-stone-800/60'
            }`}
            title={isPlayingAudio ? 'आवाज़ रोकें' : 'आवाज़ में सुनें'}
          >
            {isPlayingAudio ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Create Quote Card */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCardGenerator(item);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-800/30 transition-all"
            title="स्टेटस फोटो बनाएं"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">कार्ड</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full text-stone-400 hover:text-rose-200 hover:bg-stone-800/60 transition-all"
            title="व्हाट्सऐप या अन्य ऐप पर शेयर करें"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
};
