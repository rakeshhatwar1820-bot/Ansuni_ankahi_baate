import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Search,
  Key,
  Shield,
  AlertCircle,
  Save,
  Feather,
  Clock,
  Heart
} from 'lucide-react';
import { PoetryItem, CategoryType, MoodType } from '../types/poetry';
import {
  getAdminCredentials,
  updateAdminPin,
  isAdminLoggedIn,
  setAdminLoggedIn,
  addPost,
  updatePost,
  deletePost,
  exportAllDataAsJSON,
  importDataFromJSON,
  resetToDefaultCollection,
} from '../services/storage';
import { CATEGORY_LABELS, MOOD_TAGS } from '../data/defaultPoetry';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PoetryItem[];
  onRefreshPosts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  posts,
  onRefreshPosts,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(isAdminLoggedIn());
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'create' | 'backup' | 'settings'>('posts');

  // Create / Edit Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('shayari');
  const [formSubcategory, setFormSubcategory] = useState('रोमांटिक / Romantic');
  const [formMood, setFormMood] = useState<MoodType>('ishq');
  const [formAuthor, setFormAuthor] = useState('राकेश हटवार');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('मोहब्बत, दिल, शायरी');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings: Change PIN
  const [newPin, setNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  // Table search & filter
  const [tableSearch, setTableSearch] = useState('');
  const [tableFilterCategory, setTableFilterCategory] = useState('all');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = getAdminCredentials();
    if (pinInput.trim() === creds.pin) {
      setAdminLoggedIn(true);
      setIsAuth(true);
      setAuthError('');
      setPinInput('');
    } else {
      setAuthError('गलत पिन (Incorrect PIN). डिफ़ॉल्ट पिन: 1811');
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    setIsAuth(false);
  };

  const startCreate = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormCategory('shayari');
    setFormSubcategory('रोमांटिक / Romantic');
    setFormMood('ishq');
    setFormAuthor('राकेश हटवार');
    setFormContent('');
    setFormTags('मोहब्बत, दिल, शायरी');
    setFormStatus('published');
    setFormIsFeatured(false);
    setFormMsg(null);
    setActiveTab('create');
  };

  const startEdit = (p: PoetryItem) => {
    setEditingPostId(p.id);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormMood(p.mood);
    setFormAuthor(p.author);
    setFormContent(p.content);
    setFormTags(p.tags ? p.tags.join(', ') : '');
    setFormStatus(p.status);
    setFormIsFeatured(p.isFeatured);
    setFormMsg(null);
    setActiveTab('create');
  };

  const insertSymbol = (char: string) => {
    setFormContent((prev) => prev + char);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormMsg({ type: 'error', text: 'कृपया शीर्षक लिखें।' });
      return;
    }
    if (!formContent.trim()) {
      setFormMsg({ type: 'error', text: 'कृपया रचना का पाठ (Content) लिखें।' });
      return;
    }

    const tagList = formTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const readingTime = Math.max(1, Math.ceil(formContent.split(/\s+/).length / 75));

    if (editingPostId) {
      updatePost(editingPostId, {
        title: formTitle.trim(),
        category: formCategory,
        subcategory: formSubcategory.trim(),
        mood: formMood,
        author: formAuthor.trim(),
        content: formContent.trim(),
        tags: tagList,
        status: formStatus,
        isFeatured: formIsFeatured,
        readingTimeMinutes: readingTime,
      });
      setFormMsg({ type: 'success', text: 'रचना सफलतापूर्वक अपडेट की गई!' });
    } else {
      addPost({
        title: formTitle.trim(),
        category: formCategory,
        subcategory: formSubcategory.trim(),
        mood: formMood,
        author: formAuthor.trim(),
        content: formContent.trim(),
        tags: tagList,
        status: formStatus,
        isFeatured: formIsFeatured,
        readingTimeMinutes: readingTime,
      });
      setFormMsg({ type: 'success', text: 'नयी रचना सफलतापूर्वक प्रकाशित की गई!' });
    }

    onRefreshPosts();
    setTimeout(() => {
      setActiveTab('posts');
      setFormMsg(null);
    }, 1000);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`क्या आप वाकई "${title}" को हटाना चाहते हैं?`)) {
      deletePost(id);
      onRefreshPosts();
    }
  };

  const handleExportBackup = () => {
    const json = exportAllDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnsuniAnkahiBate-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const res = importDataFromJSON(content);
      if (res.success) {
        alert(`सफलतापूर्वक ${res.count} रचनाएं आयात (Import) की गईं!`);
        onRefreshPosts();
      } else {
        alert(`आयात त्रुटि: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('क्या आप डिफ़ॉल्ट रचनाओं को पुनर्स्थापित करना चाहते हैं?')) {
      resetToDefaultCollection();
      onRefreshPosts();
      alert('डिफ़ॉल्ट रचनाएं बहाल कर दी गईं।');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim() || newPin.length < 4) {
      setPinMsg('पिन कम से कम 4 अंकों का होना चाहिए।');
      return;
    }
    updateAdminPin(newPin.trim());
    setPinMsg('व्यवस्थापक पिन सफलतापूर्वक बदल दिया गया!');
    setNewPin('');
    setTimeout(() => setPinMsg(''), 3000);
  };

  // Metrics
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes || 0), 0);

  // Table filtering
  const filteredTablePosts = posts.filter((p) => {
    const matchCat = tableFilterCategory === 'all' || p.category === tableFilterCategory;
    const matchSearch =
      tableSearch.trim() === '' ||
      p.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.content.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.author.toLowerCase().includes(tableSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-stone-950 border border-amber-950/80 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-950/70 via-stone-950 to-stone-950 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-900/60 border border-amber-600/40 text-amber-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-hindi-serif text-xl sm:text-2xl font-bold text-amber-100">
                व्यवस्थापक डैशबोर्ड (Admin Portal)
              </h3>
              <p className="text-xs text-stone-400">
                रचनाएं लिखें, संपादित करें, प्रकाशित करें और डेटा बैकअप लें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuth && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
              >
                लॉगआउट
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content: Auth Gate or Dashboard */}
        {!isAuth ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400 mb-6 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="font-hindi-serif text-2xl font-bold text-stone-100 mb-2">
              व्यवस्थापक सुरक्षा पिन दर्ज करें
            </h4>
            <p className="text-xs text-stone-400 mb-6 font-hindi-body">
              केवल व्यवस्थापक ही रचनाएं बना या संपादित कर सकते हैं।
              <br />
              <span className="text-amber-400 font-mono mt-1 inline-block">
                डिफ़ॉल्ट पिन: 1811
              </span>
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="सुरक्षा पिन (Security PIN)"
                  className="w-full text-center tracking-widest text-lg p-3 rounded-2xl bg-stone-900 border border-amber-900/60 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-400 font-medium">{authError}</div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-semibold text-sm shadow-lg shadow-amber-950/50 transition-all"
              >
                लॉगिन करें (Unlock Dashboard)
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-stone-800 bg-stone-950 px-6 gap-3 sm:gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'posts'
                    ? 'border-amber-500 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>सभी रचनाएँ ({totalPosts})</span>
              </button>

              <button
                onClick={startCreate}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'create'
                    ? 'border-amber-500 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingPostId ? 'रचना संपादित करें' : 'नयी रचना लिखें'}</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'border-amber-500 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>डेटा बैकअप व आयात (JSON)</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-amber-500 text-amber-300 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>पिन सेटिंग्स</span>
              </button>
            </div>

            {/* Tab 1: Posts Management Table */}
            {activeTab === 'posts' && (
              <div className="p-6 overflow-y-auto space-y-5">
                {/* Metrics ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                    <div className="text-xs text-stone-400">कुल रचनाएँ</div>
                    <div className="text-xl font-bold text-white mt-1">{totalPosts}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                    <div className="text-xs text-emerald-400">प्रकाशित (Live)</div>
                    <div className="text-xl font-bold text-emerald-300 mt-1">{publishedCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                    <div className="text-xs text-amber-400">ड्राफ्ट (Drafts)</div>
                    <div className="text-xl font-bold text-amber-300 mt-1">{draftCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                    <div className="text-xs text-rose-400">कुल लाइक्स</div>
                    <div className="text-xl font-bold text-rose-300 mt-1">{totalLikes}</div>
                  </div>
                </div>

                {/* Filter and Search bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder="रचना या लेखक खोजें..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <select
                      value={tableFilterCategory}
                      onChange={(e) => setTableFilterCategory(e.target.value)}
                      className="py-2 px-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:outline-none"
                    >
                      <option value="all">सभी श्रेणियां</option>
                      <option value="shayari">शायरी</option>
                      <option value="kavita">कविता</option>
                      <option value="story">प्रेम कहानियां</option>
                      <option value="nazm">ग़ज़ल व नज़्म</option>
                    </select>
                  </div>

                  <button
                    onClick={startCreate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 text-white text-xs font-semibold shadow-md w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>नयी रचना जोड़ें</span>
                  </button>
                </div>

                {/* Posts Table */}
                <div className="rounded-2xl border border-stone-800 overflow-hidden bg-stone-900/30">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-900/80 text-stone-400 font-semibold border-b border-stone-800">
                        <tr>
                          <th className="py-3 px-4">शीर्षक व रचना</th>
                          <th className="py-3 px-3">श्रेणी</th>
                          <th className="py-3 px-3">लेखक</th>
                          <th className="py-3 px-3">स्थिति</th>
                          <th className="py-3 px-3">लाइक्स</th>
                          <th className="py-3 px-4 text-right">कार्य (Actions)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60 text-stone-300 font-hindi-body">
                        {filteredTablePosts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-stone-500">
                              कोई रचना नहीं मिली।
                            </td>
                          </tr>
                        ) : (
                          filteredTablePosts.map((p) => (
                            <tr key={p.id} className="hover:bg-stone-900/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-hindi-serif font-bold text-stone-100 text-sm">
                                  {p.title}
                                </div>
                                <div className="text-[11px] text-stone-400 line-clamp-1 max-w-xs sm:max-w-md">
                                  {p.content}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-900/40 text-[10px]">
                                  {CATEGORY_LABELS[p.category]?.hi || p.category}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-hindi-hand text-rose-200">
                                {p.author}
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  onClick={() => {
                                    const next = p.status === 'published' ? 'draft' : 'published';
                                    updatePost(p.id, { status: next });
                                    onRefreshPosts();
                                  }}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    p.status === 'published'
                                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50'
                                      : 'bg-amber-950/70 text-amber-300 border-amber-700/50'
                                  }`}
                                  title="क्लिक करके स्थिति बदलें"
                                >
                                  {p.status === 'published' ? 'लाइव' : 'ड्राफ्ट'}
                                </button>
                              </td>
                              <td className="py-3 px-3 text-stone-400">
                                {p.likes || 0}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => startEdit(p)}
                                    className="p-1.5 rounded-lg bg-stone-900 text-stone-300 hover:text-amber-300 hover:bg-stone-800"
                                    title="संपादित करें"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(p.id, p.title)}
                                    className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-rose-400 hover:bg-stone-800"
                                    title="हटाएं"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Create / Edit Post Form */}
            {activeTab === 'create' && (
              <div className="p-6 sm:p-8 overflow-y-auto">
                <form onSubmit={handleSavePost} className="space-y-5 max-w-3xl mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <h4 className="font-hindi-serif text-lg font-bold text-amber-200">
                      {editingPostId ? 'रचना संपादित करें (Edit Post)' : 'नयी रचना जोड़ें (Create New Post)'}
                    </h4>
                    {formMsg && (
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          formMsg.type === 'success'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}
                      >
                        {formMsg.text}
                      </span>
                    )}
                  </div>

                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        शीर्षक (Title):
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="उदा. तेरी ख़ामोशी में छुपा अफ़साना"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm font-hindi-body focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        श्रेणी (Category):
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                      >
                        <option value="shayari">शायरी (Shayari)</option>
                        <option value="kavita">कविता (Kavita)</option>
                        <option value="story">प्रेम कहानी (Love Story)</option>
                        <option value="nazm">ग़ज़ल व नज़्म (Nazm)</option>
                      </select>
                    </div>
                  </div>

                  {/* Subcategory & Mood & Author */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        उप-श्रेणी (Subcategory):
                      </label>
                      <input
                        type="text"
                        value={formSubcategory}
                        onChange={(e) => setFormSubcategory(e.target.value)}
                        placeholder="उदा. रोमांटिक, बारिश, इंतज़ार"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        मिजाज़ (Mood):
                      </label>
                      <select
                        value={formMood}
                        onChange={(e) => setFormMood(e.target.value as MoodType)}
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                      >
                        {MOOD_TAGS.filter((m) => m.key !== 'all').map((m) => (
                          <option key={m.key} value={m.key}>
                            {m.emoji} {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        लेखक / शायर (Author):
                      </label>
                      <input
                        type="text"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="उदा. राकेश हटवार / अनसुनी अनकही बातें"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Content area with Devanagari helpers */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-300">
                        रचना का पाठ (Poetry / Story Content):
                      </label>

                      {/* Devanagari quick symbols */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-stone-500 mr-1 hidden sm:inline">त्वरित चिन्ह:</span>
                        {['।', '॥', 'ँ', '़', '—', '’'].map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => insertSymbol(sym)}
                            className="w-6 h-6 rounded bg-stone-900 border border-stone-800 text-amber-300 hover:bg-stone-800 text-xs font-bold"
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      rows={8}
                      placeholder="यहाँ अपनी शायरी, कविता या प्रेम कहानी की पंक्तियाँ लिखें..."
                      className="w-full p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-sm font-hindi-body leading-relaxed focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Tags, Status & Featured */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        टैग्स (Tags comma-separated):
                      </label>
                      <input
                        type="text"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="उदा. मोहब्बत, दिल, बारिश"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        प्रकाशन स्थिति (Status):
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'published' | 'draft')}
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                      >
                        <option value="published">प्रकाशित (Live to Public)</option>
                        <option value="draft">ड्राफ्ट (Draft Only)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="text-xs text-stone-200 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsFeatured}
                          onChange={(e) => setFormIsFeatured(e.target.checked)}
                          className="accent-amber-500 rounded"
                        />
                        <span>होमपेज पर फ़ीचर्ड शेर बनाएं</span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => setActiveTab('posts')}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 text-stone-300 hover:text-white text-xs font-medium"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-950/50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPostId ? 'बदलाव सहेजें' : 'प्रकाशित करें'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 3: Backup & Restore */}
            {activeTab === 'backup' && (
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 max-w-2xl mx-auto">
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800">
                  <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>डेटा बैकअप डाउनलोड करें (Export JSON)</span>
                  </h4>
                  <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                    अपनी सभी शायरी, कविताएं और कहानियां एक सुरक्षित JSON फ़ाइल के रूप में डाउनलोड करें। इसे आप किसी भी समय वापस रीस्टोर कर सकते हैं।
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600/50 text-xs font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    <span>सभी {totalPosts} रचनाओं का बैकअप डाउनलोड करें</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800">
                  <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>बैकअप फ़ाइल आयात करें (Import JSON)</span>
                  </h4>
                  <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                    यदि आपके पास पहले से कोई बैकअप फ़ाइल है, तो उसे यहाँ अपलोड करके सभी रचनाएं पुनर्स्थापित करें।
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50 text-xs font-semibold cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>JSON फ़ाइल चुनें व आयात करें</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40">
                  <h4 className="font-bold text-rose-300 text-sm mb-1 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-rose-400" />
                    <span>डिफ़ॉल्ट संग्रह बहाल करें (Reset to Default)</span>
                  </h4>
                  <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                    यह सभी मूल प्रामाणिक हिंदी रचनाओं, कविताओं और प्रेम कहानियों को पुनः लोड कर देगा।
                  </p>
                  <button
                    onClick={handleResetDefaults}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-rose-950 text-rose-300 border border-rose-800/50 text-xs font-medium"
                  >
                    पुनर्स्थापित करें (Reset)
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Security Settings */}
            {activeTab === 'settings' && (
              <div className="p-6 sm:p-8 overflow-y-auto max-w-md mx-auto">
                <form onSubmit={handleChangePin} className="space-y-4">
                  <h4 className="font-hindi-serif text-lg font-bold text-amber-200">
                    सुरक्षा पिन बदलें (Change PIN)
                  </h4>
                  <p className="text-xs text-stone-400">
                    एडमिन लॉगिन हेतु एक नया 4-अंकीय या उससे बड़ा पिन सेट करें।
                  </p>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      नया पिन:
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="उदा. 2026 या myAdminSecret"
                      className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {pinMsg && (
                    <div className="text-xs text-emerald-400 font-medium">{pinMsg}</div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold"
                  >
                    नया पिन सहेजें
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
