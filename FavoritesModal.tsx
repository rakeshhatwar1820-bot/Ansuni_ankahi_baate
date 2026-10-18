import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Heart,
  Share2,
  Trash2,
  Palette,
  Volume2,
  VolumeX,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { PoetryItem } from '../types/poetry';
import { CATEGORY_LABELS } from '../data/defaultPoetry';
import { speechService } from '../services/audioSpeech';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteItems: PoetryItem[];
  onRemoveFavorite: (id: string) => void;
  onOpenCardGenerator: (item: PoetryItem) => void;
  onOpenDetail: (item: PoetryItem) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteItems,
  onRemoveFavorite,
  onOpenCardGenerator,
  onOpenDetail,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVoiceToggle = (item: PoetryItem) => {
    if (playingId === item.id) {
      speechService.stop();
      setPlayingId(null);
    } else {
      speechService.speak(item.content, () => {
        setPlayingId(null);
      });
      setPlayingId(item.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-stone-950 border border-rose-950/80 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-950/70 via-stone-950 to-stone-950 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-900/60 border border-rose-600/40 text-rose-300">
              <Bookmark className="w-5 h-5 fill-rose-300" />
            </div>
            <div>
              <h3 className="font-hindi-serif text-xl font-bold text-rose-100">
                पसंदीदा शायरी व कविताएँ (Saved Collection)
              </h3>
              <p className="text-xs text-stone-400">
                {favoriteItems.length} रचनाएँ आपके संग्रह में सुरक्षित हैं
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {favoriteItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🌹</div>
              <h4 className="font-hindi-serif text-lg font-bold text-stone-200">
                अभी कोई पसंदीदा रचना नहीं जोड़ी गई
              </h4>
              <p className="text-xs text-stone-400 mt-1 font-hindi-body">
                किसी भी शायरी या कविता के नीचे दिए गए बुकमार्क आइकन (🔖) पर क्लिक करके उसे यहाँ सहेजें।
              </p>
            </div>
          ) : (
            favoriteItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-rose-900/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div
                  onClick={() => {
                    onClose();
                    onOpenDetail(item);
                  }}
                  className="cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-900/40">
                      {CATEGORY_LABELS[item.category]?.hi || item.category}
                    </span>
                    <span className="text-xs text-stone-400">{item.subcategory}</span>
                  </div>
                  <h4 className="font-hindi-serif font-bold text-white text-base hover:text-rose-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-400 font-hindi-body line-clamp-2 mt-1">
                    {item.content}
                  </p>
                  <div className="text-[11px] text-rose-300/80 font-hindi-hand mt-1">
                    — {item.author}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleVoiceToggle(item)}
                    className={`p-2 rounded-full border transition-all ${
                      playingId === item.id
                        ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                        : 'bg-stone-900 text-stone-400 hover:text-rose-300 border-stone-800'
                    }`}
                    title="सुनिए"
                  >
                    {playingId === item.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenCardGenerator(item);
                    }}
                    className="p-2 rounded-full bg-stone-900 text-amber-300 hover:text-amber-200 border border-stone-800"
                    title="कार्ड बनाएं"
                  >
                    <Palette className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-2 rounded-full bg-stone-900 text-stone-400 hover:text-rose-400 border border-stone-800"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
