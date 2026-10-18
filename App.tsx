/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  getStoredPosts,
  getUserLikedIds,
  getUserFavoriteIds,
  toggleLikePost,
  toggleFavoritePost,
  isAdminLoggedIn,
} from './services/storage';
import { ambientSoundService } from './services/ambientAudio';
import { PoetryItem } from './types/poetry';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PoetryCard } from './components/PoetryCard';
import { PoetryDetailModal } from './components/PoetryDetailModal';
import { QuoteCardGeneratorModal } from './components/QuoteCardGeneratorModal';
import { AndroidAppModal } from './components/AndroidAppModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FavoritesModal } from './components/FavoritesModal';
import { ProjectFilesModal } from './components/ProjectFilesModal';
import { Footer } from './components/Footer';
import {
  Feather,
  Sparkles,
  ArrowUp,
  Search,
  Filter,
  Palette,
  Heart,
  Smile
} from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<PoetryItem[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeMood, setActiveMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<PoetryItem | null>(null);
  const [selectedItemForCard, setSelectedItemForCard] = useState<PoetryItem | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isProjectFilesOpen, setIsProjectFilesOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Ambient sound
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Scroll to top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadData = () => {
    const loadedPosts = getStoredPosts();
    setPosts(loadedPosts);
    setLikedIds(getUserLikedIds());
    setFavoriteIds(getUserFavoriteIds());
  };

  useEffect(() => {
    loadData();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAmbient = () => {
    const nextState = ambientSoundService.toggle();
    setIsAmbientPlaying(nextState);
  };

  const handleToggleLike = (id: string) => {
    const res = toggleLikePost(id);
    setLikedIds((prev) =>
      res.isLiked ? [...prev, id] : prev.filter((item) => item !== id)
    );
    // Update local post item likes count
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: res.newCount } : p))
    );
  };

  const handleToggleFavorite = (id: string) => {
    const isNowFav = toggleFavoritePost(id);
    setFavoriteIds((prev) =>
      isNowFav ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  // Filtered posts (Only published for public view)
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (p.status !== 'published') return false;

      // Category check
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }

      // Mood check
      if (activeMood !== 'all' && p.mood !== activeMood) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(query);
        const inContent = p.content.toLowerCase().includes(query);
        const inAuthor = p.author.toLowerCase().includes(query);
        const inSubcat = p.subcategory.toLowerCase().includes(query);
        const inTags = p.tags?.some((t) => t.toLowerCase().includes(query));
        return inTitle || inContent || inAuthor || inSubcat || inTags;
      }

      return true;
    });
  }, [posts, activeCategory, activeMood, searchQuery]);

  // Featured post
  const featuredItem = useMemo(() => {
    const featured = posts.find((p) => p.isFeatured && p.status === 'published');
    return featured || posts.find((p) => p.status === 'published') || null;
  }, [posts]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const published = posts.filter((p) => p.status === 'published');
    const counts: Record<string, number> = {
      all: published.length,
      shayari: published.filter((p) => p.category === 'shayari').length,
      kavita: published.filter((p) => p.category === 'kavita').length,
      story: published.filter((p) => p.category === 'story').length,
      nazm: published.filter((p) => p.category === 'nazm').length,
    };
    return counts;
  }, [posts]);

  // Saved favorites
  const favoriteItems = useMemo(() => {
    return posts.filter((p) => favoriteIds.includes(p.id));
  }, [posts, favoriteIds]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Navigation bar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenProjectFiles={() => setIsProjectFilesOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdmin={isAdminLoggedIn()}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
      />

      {/* Hero Section */}
      <HeroSection
        featuredItem={featuredItem}
        onLike={handleToggleLike}
        isLiked={featuredItem ? likedIds.includes(featuredItem.id) : false}
        onOpenCardModal={(item) => setSelectedItemForCard(item)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        activeMood={activeMood}
        onSelectMood={setActiveMood}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 w-full">
        {/* Active filter status indicator if filtered */}
        {(activeCategory !== 'all' || activeMood !== 'all' || searchQuery.trim() !== '') && (
          <div className="mb-8 p-4 rounded-2xl bg-stone-900/60 border border-rose-950/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-hindi-body text-stone-300">
              <Filter className="w-4 h-4 text-rose-400" />
              <span>परिणाम: <strong>{filteredPosts.length}</strong> रचनाएँ मिलीं</span>
              {searchQuery && (
                <span className="bg-stone-800 px-2.5 py-0.5 rounded-full text-rose-200">
                  खोज: "{searchQuery}"
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveMood('all');
                setSearchQuery('');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-medium"
            >
              सभी फ़िल्टर साफ़ करें (Reset Filters)
            </button>
          </div>
        )}

        {/* Poetry & Story Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/30 rounded-3xl border border-stone-800/60 p-8 max-w-lg mx-auto">
            <div className="text-5xl mb-4">📜</div>
            <h3 className="font-hindi-serif text-2xl font-bold text-stone-200 mb-2">
              कोई रचना नहीं मिली
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-hindi-body mb-6">
              आपके चुने गए फ़िल्टर या खोज शब्द के लिए कोई रचना उपलब्ध नहीं है। कृपया दूसरे शब्द आज़माएं।
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveMood('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700/50 text-xs font-semibold"
            >
              सभी रचनाएँ देखें
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((item) => (
              <PoetryCard
                key={item.id}
                item={item}
                isLiked={likedIds.includes(item.id)}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleLike={handleToggleLike}
                onToggleFavorite={handleToggleFavorite}
                onOpenCardGenerator={(it) => setSelectedItemForCard(it)}
                onOpenDetail={(it) => setSelectedItemForDetail(it)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {/* Floating Quick Card Creator button */}
        {featuredItem && (
          <button
            onClick={() => setSelectedItemForCard(featuredItem)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold shadow-xl shadow-amber-950/60 border border-amber-400/40 transition-all hover:scale-105"
            title="स्टेटस फोटो कार्ड बनाएं"
          >
            <Palette className="w-4 h-4 text-amber-200" />
            <span className="hidden sm:inline">शायरी कार्ड बनाएं</span>
          </button>
        )}

        {/* Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-700/50 shadow-xl shadow-rose-950/60 transition-all hover:scale-110"
            title="ऊपर जाएं"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Reader Modal (For full poem / stories) */}
      <PoetryDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        isLiked={selectedItemForDetail ? likedIds.includes(selectedItemForDetail.id) : false}
        isFavorite={selectedItemForDetail ? favoriteIds.includes(selectedItemForDetail.id) : false}
        onToggleLike={handleToggleLike}
        onToggleFavorite={handleToggleFavorite}
        onOpenCardGenerator={(it) => {
          setSelectedItemForDetail(null);
          setSelectedItemForCard(it);
        }}
      />

      {/* Instagram / WhatsApp Quote Card Studio */}
      <QuoteCardGeneratorModal
        item={selectedItemForCard}
        onClose={() => setSelectedItemForCard(null)}
      />

      {/* Android Native App Project & APK Guide Modal */}
      <AndroidAppModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        posts={posts}
        onRefreshPosts={loadData}
      />

      {/* Saved Favorites Drawer / Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteItems={favoriteItems}
        onRemoveFavorite={handleToggleFavorite}
        onOpenCardGenerator={(it) => setSelectedItemForCard(it)}
        onOpenDetail={(it) => setSelectedItemForDetail(it)}
      />

      {/* All Project Files Explorer & Downloader Modal */}
      <ProjectFilesModal
        isOpen={isProjectFilesOpen}
        onClose={() => setIsProjectFilesOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenProjectFiles={() => setIsProjectFilesOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />
    </div>
  );
}
