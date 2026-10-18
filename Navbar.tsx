import React, { useState } from 'react';
import {
  Feather,
  Heart,
  Bookmark,
  Volume2,
  VolumeX,
  Smartphone,
  Shield,
  Search,
  X,
  Menu,
  Sparkles,
  BookOpen,
  FolderArchive
} from 'lucide-react';
import { CategoryType } from '../types/poetry';
import { CATEGORY_LABELS } from '../data/defaultPoetry';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenAndroidModal: () => void;
  onOpenProjectFiles: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenFavorites,
  onOpenAndroidModal,
  onOpenProjectFiles,
  onOpenAdmin,
  isAdmin,
  isAmbientPlaying,
  onToggleAmbient,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'सभी' },
    { key: 'shayari', label: 'शायरी' },
    { key: 'kavita', label: 'कविता' },
    { key: 'story', label: 'प्रेम कहानियां' },
    { key: 'nazm', label: 'ग़ज़ल व नज़्म' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-rose-950/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-800 to-amber-700 flex items-center justify-center shadow-lg shadow-rose-950/50 border border-rose-500/30 group-hover:scale-105 transition-transform duration-300">
              <Feather className="w-6 h-6 text-rose-100 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-hindi-serif text-2xl font-bold tracking-wide bg-gradient-to-r from-rose-100 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                  अनसुनी अनकही बातें
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/40 hidden sm:inline-block">
                  साहित्य
                </span>
              </div>
              <p className="text-xs text-rose-300/70 font-sans tracking-wider">
                Ansuni Ankahi Bate • शायरी, कविता व इश्क़
              </p>
            </div>
          </div>

          {/* Desktop Nav Categories */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {categories.map((c) => {
              const active = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => onSelectCategory(c.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-hindi-body font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-rose-900/90 to-rose-950 text-rose-100 shadow-sm border border-rose-600/40 font-semibold'
                      : 'text-stone-300 hover:text-rose-200 hover:bg-stone-900/70'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input / Trigger */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-stone-900/90 border border-rose-500/40 rounded-full px-3 py-1.5 shadow-inner">
                  <Search className="w-4 h-4 text-rose-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="खोजें... (उदा. इश्क़, बारिश)"
                    className="bg-transparent border-none outline-none text-xs sm:text-sm text-stone-100 placeholder-stone-500 w-32 sm:w-48 font-hindi-body"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="text-stone-400 hover:text-rose-200 p-0.5 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowSearchInput(false)}
                    className="text-stone-400 hover:text-rose-200 p-0.5 ml-1 border-l border-stone-700 pl-1.5"
                    title="बंद करें"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2.5 rounded-full text-stone-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                  title="खोजें / Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Ambient Romance Music toggle */}
            <button
              onClick={onToggleAmbient}
              className={`p-2.5 rounded-full transition-all relative ${
                isAmbientPlaying
                  ? 'bg-rose-900/50 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-900/30'
                  : 'text-stone-400 hover:text-rose-200 hover:bg-stone-900/50'
              }`}
              title={isAmbientPlaying ? 'रोमांटिक संगीत बंद करें' : 'रोमांटिक परिवेश संगीत शुरू करें (Rain & Drone)'}
            >
              {isAmbientPlaying ? (
                <>
                  <Volume2 className="w-5 h-5 text-rose-400 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                </>
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            {/* Favorites / Bookmarks */}
            <button
              onClick={onOpenFavorites}
              className="p-2.5 rounded-full text-stone-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors relative"
              title="पसंदीदा शायरी (Favorites)"
            >
              <Bookmark className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-md">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Android App Button */}
            <button
              onClick={onOpenAndroidModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-950 to-emerald-900 text-emerald-200 border border-emerald-600/40 hover:border-emerald-400 transition-all shadow-sm group"
              title="Android App डाउनलोड व प्रोजेक्ट कोड"
            >
              <Smartphone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Android App</span>
            </button>

            {/* All Files Download */}
            <button
              onClick={onOpenProjectFiles}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-stone-900 hover:bg-stone-850 text-amber-200 border border-amber-600/40 hover:border-amber-400 transition-all shadow-sm group"
              title="प्रोजेक्ट की सभी फ़ाइलें देखें व ZIP डाउनलोड करें"
            >
              <FolderArchive className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>सभी फ़ाइलें (.ZIP)</span>
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-full transition-all ${
                isAdmin
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-600/50'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-stone-900/50'
              }`}
              title={isAdmin ? 'व्यवस्थापक पैनल खुला है' : 'व्यवस्थापक लॉगिन (Admin Login)'}
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-stone-300 hover:text-rose-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-950/95 border-b border-rose-950 px-4 pt-3 pb-6 space-y-3">
          <p className="text-xs font-semibold text-rose-400/80 uppercase tracking-wider px-2">
            श्रेणियां (Categories)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  onSelectCategory(c.key);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-sm font-hindi-body font-medium ${
                  activeCategory === c.key
                    ? 'bg-rose-950 text-rose-200 border border-rose-700/50 font-bold'
                    : 'text-stone-300 hover:bg-stone-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-rose-950/60 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAndroidModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm bg-emerald-950/60 text-emerald-300 border border-emerald-700/40"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android App प्रोजेक्ट व APK गाइड</span>
            </button>
            <button
              onClick={() => {
                onOpenProjectFiles();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm bg-stone-900 text-amber-300 border border-amber-800/50"
            >
              <FolderArchive className="w-4 h-4 text-amber-400" />
              <span>संपूर्ण प्रोजेक्ट फ़ाइलें (Download All Files .ZIP)</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm bg-stone-900 text-amber-300 border border-stone-800"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{isAdmin ? 'एडमिन डैशबोर्ड (Dashboard)' : 'एडमिन लॉगिन (Admin Panel)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
