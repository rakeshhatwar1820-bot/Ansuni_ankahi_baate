import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Square,
  Sliders,
  Type,
  Palette,
  Eye
} from 'lucide-react';
import { PoetryItem } from '../types/poetry';

interface QuoteCardGeneratorModalProps {
  item: PoetryItem | null;
  onClose: () => void;
}

type AspectRatio = 'square' | 'story' | 'post';
type ThemeName = 'burgundy' | 'parchment' | 'midnight' | 'sunset' | 'emerald';
type FontOption = 'serif' | 'hand' | 'body';

export const QuoteCardGeneratorModal: React.FC<QuoteCardGeneratorModalProps> = ({
  item,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [aspect, setAspect] = useState<AspectRatio>('square');
  const [theme, setTheme] = useState<ThemeName>('burgundy');
  const [fontOption, setFontOption] = useState<FontOption>('serif');
  const [fontSize, setFontSize] = useState<number>(36);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [showAuthor, setShowAuthor] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [customText, setCustomText] = useState<string>('');

  useEffect(() => {
    if (item) {
      // Pick first 4-6 lines for quote card
      const lines = item.content.split('\n').filter((l) => l.trim().length > 0);
      setCustomText(lines.slice(0, 6).join('\n'));
    }
  }, [item?.id]);

  const drawCanvas = () => {
    if (!item) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine dimensions (High-res for pristine export)
    let width = 1080;
    let height = 1080;
    if (aspect === 'story') {
      width = 1080;
      height = 1920;
    } else if (aspect === 'post') {
      width = 1080;
      height = 1350;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    let textColor = '#ffffff';
    let subTextColor = '#fecdd3';
    let borderColor = 'rgba(244, 63, 94, 0.4)';

    if (theme === 'burgundy') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#24060d');
      grad.addColorStop(0.5, '#4a0e1b');
      grad.addColorStop(1, '#1a0409');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle texture lines
      ctx.strokeStyle = 'rgba(255, 200, 210, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < height; i += 80) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i + 40);
        ctx.stroke();
      }
      textColor = '#fff1f2';
      subTextColor = '#fda4af';
      borderColor = 'rgba(251, 113, 133, 0.45)';
    } else if (theme === 'parchment') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fef9f0');
      grad.addColorStop(0.5, '#f7ede2');
      grad.addColorStop(1, '#ebd7c1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      textColor = '#2b1810';
      subTextColor = '#6b4432';
      borderColor = 'rgba(107, 68, 50, 0.35)';
    } else if (theme === 'midnight') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#060814');
      grad.addColorStop(0.5, '#12142e');
      grad.addColorStop(1, '#05060e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw starry dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97) % width;
        const sy = (i * 139) % height;
        const sr = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      textColor = '#f8fafc';
      subTextColor = '#94a3b8';
      borderColor = 'rgba(148, 163, 184, 0.3)';
    } else if (theme === 'sunset') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#2d081f');
      grad.addColorStop(0.6, '#6b1735');
      grad.addColorStop(1, '#9f323f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      textColor = '#fff1f2';
      subTextColor = '#fbcfe8';
      borderColor = 'rgba(244, 114, 182, 0.4)';
    } else if (theme === 'emerald') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#041710');
      grad.addColorStop(0.5, '#0c2d20');
      grad.addColorStop(1, '#020d09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      textColor = '#f0fdf4';
      subTextColor = '#86efac';
      borderColor = 'rgba(74, 222, 128, 0.35)';
    }

    // 2. Draw Elegant Border Frame
    const inset = 55;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

    // Decorative corners
    const cSize = 25;
    ctx.lineWidth = 4;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(inset - 5, inset + cSize);
    ctx.lineTo(inset - 5, inset - 5);
    ctx.lineTo(inset + cSize, inset - 5);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - inset + 5 - cSize, inset - 5);
    ctx.lineTo(width - inset + 5, inset - 5);
    ctx.lineTo(width - inset + 5, inset + cSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(inset - 5, height - inset - cSize);
    ctx.lineTo(inset - 5, height - inset + 5);
    ctx.lineTo(inset + cSize, height - inset + 5);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - inset + 5 - cSize, height - inset + 5);
    ctx.lineTo(width - inset + 5, height - inset + 5);
    ctx.lineTo(width - inset + 5, height - inset + 5 - cSize);
    ctx.stroke();

    // 3. Category / Subcategory Header
    ctx.fillStyle = subTextColor;
    ctx.font = '600 24px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.subcategory.toUpperCase(), width / 2, inset + 65);

    // Subtle divider
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, inset + 90);
    ctx.lineTo(width / 2 + 80, inset + 90);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Center Poetry Text
    let fontName = 'Rozha One, Tiro Devanagari Hindi, serif';
    if (fontOption === 'hand') {
      fontName = 'Kalam, cursive, sans-serif';
    } else if (fontOption === 'body') {
      fontName = 'Tiro Devanagari Hindi, Poppins, serif';
    }

    ctx.fillStyle = textColor;
    ctx.font = `500 ${fontSize * 1.3}px ${fontName}`;
    ctx.textAlign = 'center';

    const textLines = (customText || item.content).split('\n');
    const lineHeight = fontSize * 2.1;
    const totalTextHeight = textLines.length * lineHeight;
    let startY = (height - totalTextHeight) / 2 + lineHeight / 2;

    // If story mode, offset slightly higher
    if (aspect === 'story') {
      startY = height * 0.42 - totalTextHeight / 2;
    }

    textLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startY + idx * lineHeight);
    });

    // 5. Author Signature
    if (showAuthor) {
      const authorY = startY + textLines.length * lineHeight + 45;
      ctx.fillStyle = subTextColor;
      ctx.font = 'bold 30px Kalam, cursive, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`— ${item.author}`, width / 2, authorY);
    }

    // 6. Watermark Footer
    if (showWatermark) {
      ctx.fillStyle = subTextColor;
      ctx.font = '500 22px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Ansuni Ankahi Bate • अनसुनी अनकही बातें', width / 2, height - inset - 30);
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [customText, aspect, theme, fontOption, fontSize, showWatermark, showAuthor, item]);

  const handleDownload = () => {
    if (!item) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    const link = document.createElement('a');
    link.download = `Ansuni-Ankahi-Bate-${item.title.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setTimeout(() => setDownloading(false), 800);
  };

  const handleCopyText = async () => {
    if (!item) return;
    const textToCopy = `*${item.title}*\n\n${customText}\n\n— *${item.author}*\n\n✨ 'अनसुनी अनकही बातें'`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-stone-950 border border-rose-950/80 shadow-2xl overflow-hidden my-auto flex flex-col md:flex-row">
        {/* Left Side: Live Preview Canvas */}
        <div className="md:w-1/2 p-6 bg-stone-900/50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-rose-950/60">
          <div className="text-xs text-rose-300 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>लाइव कार्ड प्रिव्यू (Live Card Preview)</span>
          </div>

          <div className="w-full flex items-center justify-center max-h-[460px] overflow-hidden p-2 rounded-2xl bg-black/40 border border-stone-800">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[420px] object-contain rounded-xl shadow-2xl"
            />
          </div>

          <p className="text-[11px] text-stone-500 mt-3 text-center">
            उच्च-गुणवत्ता (HD 1080p) PNG इमेज व्हाट्सऐप व इंस्टाग्राम स्टेटस के लिए
          </p>
        </div>

        {/* Right Side: Customization Controls */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <h3 className="font-hindi-serif text-xl font-bold text-rose-100">
                  शायरी कार्ड स्टूडियो
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editable lines */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-stone-300 font-hindi-body">
                पंक्तियाँ (Text to display):
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={3}
                className="mt-1 w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm font-hindi-body focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Aspect Ratio */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-stone-300 font-hindi-body">
                आकार (Aspect Ratio):
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {[
                  { key: 'square', label: '1:1 Square (Post)', icon: Square },
                  { key: 'story', label: '9:16 Story (Status)', icon: Smartphone },
                  { key: 'post', label: '4:5 Portrait', icon: Sliders },
                ].map((a) => {
                  const Icon = a.icon;
                  const active = aspect === a.key;
                  return (
                    <button
                      key={a.key}
                      onClick={() => setAspect(a.key as AspectRatio)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs transition-all border ${
                        active
                          ? 'bg-rose-950 text-rose-200 border-rose-600 font-bold'
                          : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span>{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Themes */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-stone-300 font-hindi-body">
                रंग व पृष्ठभूमि (Color Theme):
              </label>
              <div className="grid grid-cols-5 gap-2 mt-1.5">
                {[
                  { key: 'burgundy', name: 'मखमली लाल', color: '#4a0e1b' },
                  { key: 'parchment', name: 'शाही कागज़', color: '#ebd7c1' },
                  { key: 'midnight', name: 'आधी रात', color: '#12142e' },
                  { key: 'sunset', name: 'गोधूलि शाम', color: '#6b1735' },
                  { key: 'emerald', name: 'पन्ना हरा', color: '#0c2d20' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key as ThemeName)}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${
                      theme === t.key
                        ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                        : 'border-stone-700 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: t.color }}
                    title={t.name}
                  >
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-stone-300 font-hindi-body">
                फ़ॉन्ट शैली (Typography):
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {[
                  { key: 'serif', label: 'शाही सेरिफ़ (Rozha)' },
                  { key: 'hand', label: 'हस्तलिखित (Kalam)' },
                  { key: 'body', label: 'क्लासिक (Tiro)' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFontOption(f.key as FontOption)}
                    className={`p-2 rounded-xl text-xs transition-all border ${
                      fontOption === f.key
                        ? 'bg-rose-950 text-rose-200 border-rose-600 font-bold'
                        : 'bg-stone-900 text-stone-400 border-stone-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders & Toggles */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-stone-400 mb-1">
                  <span>अक्षर का आकार (Font Size):</span>
                  <span>{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-xs text-stone-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAuthor}
                    onChange={(e) => setShowAuthor(e.target.checked)}
                    className="accent-rose-600 rounded"
                  />
                  <span>शायर का नाम दिखाएँ ({item.author})</span>
                </label>

                <label className="text-xs text-stone-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => setShowWatermark(e.target.checked)}
                    className="accent-rose-600 rounded"
                  />
                  <span>Ansuni Ankahi Bate लोगो</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-600 hover:to-rose-800 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'डाउनलोड हो रहा है...' : 'कार्ड डाउनलोड करें (HD PNG)'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-sm transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'कॉपी हो गया!' : 'टेक्स्ट कॉपी करें'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
