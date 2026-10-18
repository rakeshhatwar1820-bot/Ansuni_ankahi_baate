export type CategoryType = 'shayari' | 'kavita' | 'story' | 'nazm';

export type MoodType = 'ishq' | 'dard' | 'yaadein' | 'baarish' | 'tanhai' | 'zindagi' | 'intezar';

export interface PoetryItem {
  id: string;
  title: string;
  content: string;
  category: CategoryType;
  subcategory: string;
  mood: MoodType;
  author: string;
  tags: string[];
  likes: number;
  views: number;
  isFeatured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
}

export interface AdminCredentials {
  pin: string;
  adminName: string;
}

export interface CardStyleConfig {
  backgroundTheme: 'wine' | 'parchment' | 'midnight' | 'sunset' | 'emerald' | 'monochrome';
  fontFamily: 'serif' | 'hand' | 'body';
  aspectRatio: 'square' | 'story' | 'post';
  textColor: string;
  watermark: boolean;
  showAuthor: boolean;
  fontSize: number;
}
