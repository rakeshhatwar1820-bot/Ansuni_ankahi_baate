import { PoetryItem, AdminCredentials } from '../types/poetry';
import { INITIAL_POETRY_ITEMS } from '../data/defaultPoetry';

const STORAGE_KEY_POSTS = 'ansuni_posts_v2';
const STORAGE_KEY_LIKES = 'ansuni_user_likes_v2';
const STORAGE_KEY_FAVORITES = 'ansuni_user_favorites_v2';
const STORAGE_KEY_ADMIN = 'ansuni_admin_cred_v2';
const STORAGE_KEY_ADMIN_LOGGED = 'ansuni_admin_auth_v2';

const DEFAULT_ADMIN: AdminCredentials = {
  pin: '1811',
  adminName: 'Rakesh Hatwar (Admin)',
};

export const getStoredPosts = (): PoetryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POETRY_ITEMS));
      return INITIAL_POETRY_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_POETRY_ITEMS;
  } catch (err) {
    console.error('Failed to load posts from storage', err);
    return INITIAL_POETRY_ITEMS;
  }
};

export const saveStoredPosts = (posts: PoetryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts to storage', err);
  }
};

export const addPost = (newPost: Omit<PoetryItem, 'id' | 'createdAt' | 'likes' | 'views'>): PoetryItem => {
  const posts = getStoredPosts();
  const created: PoetryItem = {
    ...newPost,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    likes: 0,
    views: 1,
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...posts];
  saveStoredPosts(updated);
  return created;
};

export const updatePost = (id: string, partial: Partial<PoetryItem>): PoetryItem | null => {
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updatedItem: PoetryItem = {
    ...posts[index],
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  posts[index] = updatedItem;
  saveStoredPosts(posts);
  return updatedItem;
};

export const deletePost = (id: string): boolean => {
  const posts = getStoredPosts();
  const filtered = posts.filter((p) => p.id !== id);
  saveStoredPosts(filtered);
  return true;
};

export const getUserLikedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIKES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleLikePost = (id: string): { isLiked: boolean; newCount: number } => {
  const likedIds = getUserLikedIds();
  const isAlreadyLiked = likedIds.includes(id);
  const posts = getStoredPosts();
  const post = posts.find((p) => p.id === id);
  let newCount = post ? post.likes : 0;

  let newLikedIds: string[];
  if (isAlreadyLiked) {
    newLikedIds = likedIds.filter((item) => item !== id);
    newCount = Math.max(0, newCount - 1);
  } else {
    newLikedIds = [...likedIds, id];
    newCount = newCount + 1;
  }

  localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(newLikedIds));

  if (post) {
    updatePost(id, { likes: newCount });
  }

  return { isLiked: !isAlreadyLiked, newCount };
};

export const getUserFavoriteIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleFavoritePost = (id: string): boolean => {
  const favIds = getUserFavoriteIds();
  const isFav = favIds.includes(id);
  const updated = isFav ? favIds.filter((item) => item !== id) : [...favIds, id];
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
  return !isFav;
};

export const incrementViewCount = (id: string): void => {
  const posts = getStoredPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    updatePost(id, { views: (post.views || 0) + 1 });
  }
};

// Admin authentication
export const getAdminCredentials = (): AdminCredentials => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN);
    return raw ? JSON.parse(raw) : DEFAULT_ADMIN;
  } catch {
    return DEFAULT_ADMIN;
  }
};

export const updateAdminPin = (newPin: string, adminName?: string): void => {
  const current = getAdminCredentials();
  const updated: AdminCredentials = {
    pin: newPin,
    adminName: adminName || current.adminName,
  };
  localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(updated));
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem(STORAGE_KEY_ADMIN_LOGGED) === 'true';
};

export const setAdminLoggedIn = (status: boolean): void => {
  if (status) {
    localStorage.setItem(STORAGE_KEY_ADMIN_LOGGED, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY_ADMIN_LOGGED);
  }
};

// Export & Import backup
export const exportAllDataAsJSON = (): string => {
  const posts = getStoredPosts();
  const backup = {
    version: '2.0',
    appName: 'Ansuni Ankahi Bate',
    exportedAt: new Date().toISOString(),
    totalPosts: posts.length,
    posts,
  };
  return JSON.stringify(backup, null, 2);
};

export const importDataFromJSON = (jsonString: string): { success: boolean; count: number; error?: string } => {
  try {
    const parsed = JSON.parse(jsonString);
    const candidatePosts = Array.isArray(parsed) ? parsed : parsed.posts;
    if (!Array.isArray(candidatePosts)) {
      return { success: false, count: 0, error: 'अमान्य फ़ाइल प्रारूप (Invalid JSON format)' };
    }
    saveStoredPosts(candidatePosts);
    return { success: true, count: candidatePosts.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'गलत डेटा संरचना' };
  }
};

export const resetToDefaultCollection = (): PoetryItem[] => {
  saveStoredPosts(INITIAL_POETRY_ITEMS);
  return INITIAL_POETRY_ITEMS;
};
