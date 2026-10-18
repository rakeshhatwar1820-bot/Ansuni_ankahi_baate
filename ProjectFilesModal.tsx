import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  FileCode,
  Copy,
  Check,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { downloadFullProjectZip } from '../services/fullProjectExporter';

interface ProjectFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectFilesModal: React.FC<ProjectFilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');
  const [copied, setCopied] = useState(false);

  // Load all raw source files using Vite's eager raw import
  const rawFiles = import.meta.glob(
    [
      '/index.html',
      '/package.json',
      '/tsconfig.json',
      '/vite.config.ts',
      '/metadata.json',
      '/.env.example',
      '/src/**/*',
      '/.github/**/*',
    ],
    { query: '?raw', import: 'default', eager: true }
  ) as Record<string, string>;

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadFullProjectZip();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error downloading project zip', err);
      alert('ज़िप तैयार करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  // Format file list for clean display
  const fileEntries = Object.keys(rawFiles).map((path) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return {
      rawKey: path,
      displayPath: cleanPath,
      name: cleanPath.split('/').pop() || cleanPath,
      content: rawFiles[path] || '',
    };
  });

  const currentFile = fileEntries.find((f) => f.displayPath === selectedFile) || fileEntries[0];

  const handleCopyCode = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-stone-950 border border-rose-950/80 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-950/80 via-stone-950 to-stone-950 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-900/60 border border-rose-600/40 text-rose-300">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-hindi-serif text-xl sm:text-2xl font-bold text-rose-100">
                  Ansuni Ankahi Bate - संपूर्ण प्रोजेक्ट फ़ाइलें
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-700/40">
                  {fileEntries.length} Files Ready
                </span>
              </div>
              <p className="text-xs text-stone-400">
                वेबसाइट, एडमिन डैशबोर्ड, ऑटोमैटिक APK बिल्डर और सभी कम्पोनेंट्स का पूरा सोर्स कोड
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/50 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloading
                  ? 'ज़िप बन रही है...'
                  : downloadSuccess
                  ? 'डाउनलोड हो गया! 🎉'
                  : 'पूरी प्रोजेक्ट ZIP डाउनलोड करें'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Split view (File Explorer on Left, Code Viewer on Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer sidebar */}
          <div className="md:w-72 bg-stone-900/40 border-b md:border-b-0 md:border-r border-stone-800 p-3 overflow-y-auto max-h-56 md:max-h-none">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400/80 px-2 py-1 mb-1">
              प्रोजेक्ट फ़ाइल ट्री (Project Files)
            </div>
            <div className="space-y-0.5 font-mono text-xs">
              {fileEntries.map((file) => {
                const isSelected = file.displayPath === selectedFile;
                return (
                  <button
                    key={file.displayPath}
                    onClick={() => setSelectedFile(file.displayPath)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-rose-950 text-rose-200 border border-rose-700/50 font-bold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                      <span className="truncate">{file.displayPath}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-950">
            {/* File info bar */}
            <div className="px-5 py-3 border-b border-stone-800/80 bg-stone-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-rose-200 font-bold">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{currentFile?.displayPath}</span>
                <span className="text-stone-500 text-[11px] font-normal">
                  ({(currentFile?.content.length || 0).toLocaleString()} characters)
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>इस फ़ाइल का कोड कॉपी करें</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto bg-black/50">
              <pre className="font-mono text-xs text-stone-300 leading-relaxed whitespace-pre select-text">
                {currentFile?.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3.5 bg-stone-900/80 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 font-hindi-body">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              यह संपूर्ण कोडबेस स्वतंत्र रूप से चलाने योग्य है (`npm install` &amp; `npm run dev`)।
            </span>
          </div>

          <button
            onClick={handleDownloadZip}
            className="text-amber-400 hover:text-amber-300 font-bold underline"
          >
            सभी फ़ाइलें एक साथ डाउनलोड करें (.ZIP)
          </button>
        </div>
      </div>
    </div>
  );
};
