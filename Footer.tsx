import React from 'react';
import { Feather, Heart, Smartphone, Shield, Sparkles, FolderArchive } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenAndroidModal: () => void;
  onOpenProjectFiles: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAndroidModal,
  onOpenProjectFiles,
  onOpenAdmin,
}) => {
  return (
    <footer className="mt-20 border-t border-rose-950/70 bg-stone-950 text-stone-400 font-hindi-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-800 to-amber-700 flex items-center justify-center border border-rose-600/30">
                <Feather className="w-5 h-5 text-rose-100" />
              </div>
              <span className="font-hindi-serif text-2xl font-bold bg-gradient-to-r from-rose-100 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                अनसुनी अनकही बातें
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              "लफ़्ज़ों में समेटी हुई वो ख़ामोशियाँ, जो दिल से निकलकर रूह तक पहुँचती हैं।"
              हिन्दी साहित्य, शायरी, कविता, ग़ज़ल और प्रेम कहानियों का एक पवित्र संगम।
            </p>
            <div className="text-xs text-rose-300/80 font-hindi-hand">
              रचनाकार व संकलन: राकेश हटवार (Rakesh Hatwar)
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-3">
              साहित्य श्रेणियां
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('shayari')}
                  className="hover:text-rose-200 transition-colors"
                >
                  हिन्दी शायरी (Romantic & Dard)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('kavita')}
                  className="hover:text-rose-200 transition-colors"
                >
                  भावपूर्ण कविताएं (Kavita)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('story')}
                  className="hover:text-rose-200 transition-colors"
                >
                  प्रेम कहानियां (Love Stories)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('nazm')}
                  className="hover:text-rose-200 transition-colors"
                >
                  ग़ज़ल व नज़्म (Urdu & Hindi)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Apps & Tools */}
          <div>
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-3">
              मोबाइल व एडमिन
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenAndroidModal}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android Studio Project (.ZIP)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAndroidModal}
                  className="hover:text-stone-200 transition-colors"
                >
                  Android APK कैसे बनाएं (गाइड)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenProjectFiles}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>संपूर्ण प्रोजेक्ट फ़ाइलें (.ZIP)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>व्यवस्थापक डैशबोर्ड (Admin Login)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-rose-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Ansuni Ankahi Bate (अनसुनी अनकही बातें). सर्वाधिकार सुरक्षित।
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>मोहब्बत और साहित्य के साथ निर्मित</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
