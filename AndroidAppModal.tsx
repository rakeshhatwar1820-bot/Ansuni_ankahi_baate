import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  ShieldCheck,
  Terminal,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { generateAndroidProjectZip } from '../services/androidProjectGenerator';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'preview' | 'guide' | 'github'>('github');
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedPkg, setCopiedPkg] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;
  const packageName = 'com.ansuni.ankahibate';

  const handleDownloadProjectZip = async () => {
    try {
      setIsGeneratingZip(true);
      const blob = await generateAndroidProjectZip({
        appName: 'Ansuni Ankahi Bate',
        packageName,
        appUrl,
        versionName: '1.0.0',
        versionCode: 1,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AnsuniAnkahiBate-Android-App.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate android project zip', err);
      alert('प्रोजेक्ट ज़िप तैयार करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleCopyPackage = () => {
    navigator.clipboard.writeText(packageName);
    setCopiedPkg(true);
    setTimeout(() => setCopiedPkg(false), 2000);
  };

  const workflowYaml = `name: Build Ansuni Ankahi Bate Android APK

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Make Gradle Wrapper Executable
        run: |
          if [ -f "./gradlew" ]; then
            chmod +x ./gradlew
          fi

      - name: Build Android Debug APK
        run: |
          if [ -f "./gradlew" ]; then
            ./gradlew assembleDebug --no-daemon --stacktrace
          elif [ -f "./AnsuniAnkahiBate-Android-App/gradlew" ]; then
            cd AnsuniAnkahiBate-Android-App
            chmod +x ./gradlew
            ./gradlew assembleDebug --no-daemon --stacktrace
          else
            echo "Checking gradle build files..."
            gradle assembleDebug --no-daemon --stacktrace
          fi

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: AnsuniAnkahiBate-debug-apk
          path: |
            **/build/outputs/apk/debug/*.apk
          retention-days: 30
          if-no-files-found: error`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-stone-950 border border-emerald-950/80 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/80 via-stone-950 to-stone-950 border-b border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-hindi-serif text-xl sm:text-2xl font-bold text-emerald-100">
                  Ansuni Ankahi Bate - Android App
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                  Ready to Build
                </span>
              </div>
              <p className="text-xs text-stone-400">
                पूर्ण नेटिव एंड्रॉइड प्रोजेक्ट (Kotlin + Jetpack + Gradle) और प्रत्यक्ष APK गाइड
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('github')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-emerald-500 text-emerald-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>GitHub Actions APK (मोबाइल से)</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-emerald-500 text-emerald-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>प्रोजेक्ट डाउनलोड (Project Zip)</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-emerald-500 text-emerald-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>फ़ोन सिम्युलेटर (Phone Preview)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>3-मिनट PC गाइड</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {activeTab === 'download' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-800/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-white font-hindi-serif">
                      1-क्लिक में पूरा Android Studio प्रोजेक्ट डाउनलोड करें
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-300 font-hindi-body mt-1">
                      इसमें सभी आवश्यक फ़ाइलें शामिल हैं: Kotlin कोड, Gradle बिल्ड स्क्रिप्ट्स, AndroidManifest, और रोमांटिक थीम रिसोर्स।
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadProjectZip}
                    disabled={isGeneratingZip}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 transition-all flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isGeneratingZip
                        ? 'ज़िप तैयार हो रही है...'
                        : downloadSuccess
                        ? 'डाउनलोड हो गया! 🎉'
                        : 'Android Project (.ZIP) डाउनलोड करें'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Package & Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
                  <div className="text-[11px] text-stone-400">Package Name</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-mono text-emerald-300 font-bold">
                      {packageName}
                    </span>
                    <button
                      onClick={handleCopyPackage}
                      className="p-1 text-stone-400 hover:text-white"
                      title="कॉपी करें"
                    >
                      {copiedPkg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
                  <div className="text-[11px] text-stone-400">Target Platform</div>
                  <div className="text-xs font-mono text-stone-200 font-bold mt-1">
                    Android 14 (API 34)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
                  <div className="text-[11px] text-stone-400">Min Android Version</div>
                  <div className="text-xs font-mono text-stone-200 font-bold mt-1">
                    Android 7.0+ (99.2% phones)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
                  <div className="text-[11px] text-stone-400">App Type</div>
                  <div className="text-xs font-mono text-emerald-400 font-bold mt-1">
                    Native Kotlin + WebView Bridge
                  </div>
                </div>
              </div>

              {/* Included files list */}
              <div className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>ज़िप में शामिल मूल फ़ाइलें (Project Architecture):</span>
                </h5>
                <ul className="text-xs font-mono text-stone-400 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>app/src/main/java/com/ansuni/ankahibate/MainActivity.kt (Pull-to-refresh & back navigation)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>app/src/main/AndroidManifest.xml (Internet & network permissions configured)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>build.gradle.kts & app/build.gradle.kts (Kotlin 1.9 & AGP 8.3+)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>res/values/colors.xml & themes.xml (Romantic Burgundy & Gold theme)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>README.md (शुरुआती यूज़र्स के लिए सचित्र चरण-दर-चरण गाइड)</span>
                  </li>
                </ul>
              </div>

              {/* PWA Direct install tip */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 font-hindi-body">
                  <strong className="text-amber-100 font-semibold block mb-0.5">
                    बिना Android Studio के भी तुरंत अपने मोबाइल पर इंस्टॉल करें:
                  </strong>
                  अपने Android फोन के Chrome ब्राउज़र में यह वेबसाइट खोलें, ऊपर 3-डॉट्स मेनू पर टैप करें और <span className="underline font-bold">"Add to Home screen"</span> चुनें। यह तुरंत आपके फोन में नेटिव ऐप की तरह इंस्टॉल हो जाएगी!
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-stone-400 mb-4 text-center">
                Android डिवाइस में Ansuni Ankahi Bate का प्रत्यक्ष दृश्य (Live Simulated View):
              </div>

              {/* Phone Frame Mockup */}
              <div className="relative w-[300px] h-[580px] bg-stone-900 border-[8px] border-stone-800 rounded-[42px] shadow-2xl shadow-rose-950/60 overflow-hidden flex flex-col">
                {/* Speaker notch */}
                <div className="w-full h-6 bg-stone-950 flex items-center justify-center relative">
                  <div className="w-16 h-3 bg-stone-800 rounded-full" />
                  <div className="absolute right-4 w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>

                {/* Status Bar */}
                <div className="w-full bg-[#4a0e17] px-4 py-1 flex items-center justify-between text-[10px] text-rose-100 font-mono">
                  <span>10:45</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>98%</span>
                  </div>
                </div>

                {/* Live App Frame */}
                <div className="flex-1 bg-stone-950 overflow-y-auto p-3 text-stone-100 font-hindi-body text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-rose-900/50">
                    <span className="font-hindi-serif font-bold text-rose-200">
                      अनसुनी अनकही बातें
                    </span>
                  </div>
                  <div className="my-3 p-3 rounded-xl bg-stone-900 border border-rose-900/40">
                    <div className="text-[10px] text-rose-400 font-semibold">रोमांटिक शायरी</div>
                    <p className="mt-1 text-xs text-rose-50 font-hindi-serif">
                      तेरी ख़ामोशी में छुपा अफ़साना,
                      <br />
                      कुछ बातें लफ़्ज़ों से बयां नहीं होतीं...
                    </p>
                    <div className="mt-2 flex justify-between text-[9px] text-stone-400">
                      <span>— राकेश हटवार</span>
                      <span>❤️ 184</span>
                    </div>
                  </div>
                  <div className="my-2 p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <div className="text-[10px] text-amber-400 font-semibold">कविता</div>
                    <p className="mt-1 text-xs text-stone-300">
                      बारिश, चाय और तुम्हारी यादें...
                    </p>
                  </div>
                </div>

                {/* Android Navigation Bar */}
                <div className="w-full h-8 bg-stone-950 flex items-center justify-center gap-8">
                  <div className="w-3 h-3 border-l-2 border-b-2 border-stone-400 -rotate-45" />
                  <div className="w-3 h-3 rounded-full border-2 border-stone-400" />
                  <div className="w-3 h-3 border-2 border-stone-400" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6 text-stone-300 font-hindi-body">
              <h4 className="text-base font-bold text-emerald-300 font-hindi-serif">
                3 मिनट में अपना पहला Android APK तैयार करें (100% Free)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold flex items-center justify-center text-xs mb-3">
                    1
                  </div>
                  <h5 className="font-bold text-white text-sm mb-1">प्रोजेक्ट खोलें</h5>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    डाउनलोड की गई ज़िप फ़ाइल को अनज़िप करें। Android Studio खोलें और <strong>File → Open</strong> करके फ़ोल्डर चुनें।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold flex items-center justify-center text-xs mb-3">
                    2
                  </div>
                  <h5 className="font-bold text-white text-sm mb-1">APK बनाएं</h5>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    ऊपर मेनू में <strong>Build → Build Bundle(s) / APK(s) → Build APK(s)</strong> पर क्लिक करें। 1 मिनट में APK तैयार!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold flex items-center justify-center text-xs mb-3">
                    3
                  </div>
                  <h5 className="font-bold text-white text-sm mb-1">फ़ोन में भेजें व चलाएं</h5>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    बनने के बाद "locate" पर क्लिक करें और <strong>app-debug.apk</strong> को सीधे व्हाट्सऐप या केबल से फोन में डालकर इंस्टॉल कर लें!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800">
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-2">
                  Google Play Store पर कैसे डालें?
                </h5>
                <p className="text-xs text-stone-400 leading-relaxed">
                  जब आप इसे प्ले स्टोर पर लाइव करना चाहें, तो Android Studio में <strong>Build → Generate Signed Bundle / APK</strong> पर क्लिक करके AAB (Android App Bundle) फ़ाइल बनाएं और Google Play Console पर अपलोड कर दें।
                </p>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-6 text-stone-300 font-hindi-body">
              {/* Security Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/50 flex items-start gap-3 shadow-lg">
                <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-200">
                    100% सुरक्षित और निःशुल्क (No Personal Access Token Required)
                  </h4>
                  <p className="text-xs text-emerald-300/80 mt-0.5 leading-relaxed">
                    किसी भी थर्ड-पार्टी वेबसाइट या अज्ञात सर्विस को अपना GitHub टोकन/पासवर्ड देने की बिल्कुल ज़रूरत नहीं है। यह बिल्ड GitHub के अपने आधिकारिक सुरक्षित रनर पर चलता है और सीधा APK तैयार करता है।
                  </p>
                </div>
              </div>

              {/* Step-by-Step mobile guide */}
              <div>
                <h4 className="text-base font-bold text-white font-hindi-serif mb-3">
                  अपने Android मोबाइल पर GitHub Actions से APK कैसे बनाएं:
                </h4>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-1 text-xs">
                      <strong className="text-sm text-stone-100 font-semibold block">
                        मोबाइल के Chrome ब्राउज़र में GitHub पर New Repository बनाएं
                      </strong>
                      <p className="text-stone-400 leading-relaxed">
                        अपने फ़ोन में <a href="https://github.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">github.com</a> खोलें। ऊपर <strong>'+'</strong> आइकन पर टैप करें और <strong>"New repository"</strong> चुनें। Repository name में <code>ansuni-ankahi-bate</code> लिखें और <strong>Public</strong> रखकर <strong>"Create repository"</strong> पर टैप करें।
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1 text-xs">
                      <strong className="text-sm text-stone-100 font-semibold block">
                        प्रोजेक्ट ZIP या फ़ाइलें अपलोड करें
                      </strong>
                      <p className="text-stone-400 leading-relaxed">
                        रिपॉजिटरी में <strong>"uploading an existing file"</strong> लिंक पर टैप करें। हमारी ऐप के "प्रोजेक्ट डाउनलोड" टैब से डाउनलोड की गई ZIP को अनज़िप करके फ़ाइलें चुनें (जिसमें <code>.github/workflows/build-apk.yml</code> पहले से सेट है) और <strong>"Commit changes"</strong> दबाएँ।
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1 text-xs">
                      <strong className="text-sm text-stone-100 font-semibold block">
                        Actions टैब में जाकर "Run workflow" पर टैप करें
                      </strong>
                      <p className="text-stone-400 leading-relaxed">
                        रिपॉजिटरी के ऊपर मौजूद <strong>"Actions"</strong> टैब पर टैप करें। बायीं तरफ़ <strong>"Build Ansuni Ankahi Bate Android APK"</strong> दिखेगा, उसपर टैप करके <strong>"Run workflow"</strong> बटन दबाएँ।
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="space-y-1 text-xs">
                      <strong className="text-sm text-stone-100 font-semibold block">
                        2 मिनट में Artifacts से APK डाउनलोड व इंस्टॉल करें
                      </strong>
                      <p className="text-stone-400 leading-relaxed">
                        बिल्ड पूरा होने पर हरा टिक (✅) दिखेगा। उसपर टैप करके नीचे स्क्रॉल करें, <strong>"Artifacts"</strong> सेक्शन में <strong>"AnsuniAnkahiBate-debug-apk"</strong> मिलेगा। उसपर टैप करते ही APK आपके मोबाइल में डाउनलोड हो जाएगा!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow YAML code snippet */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                    <Code2 className="w-4 h-4" />
                    <span>.github/workflows/build-apk.yml</span>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(workflowYaml);
                      setCopiedWorkflow(true);
                      setTimeout(() => setCopiedWorkflow(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-all"
                  >
                    {copiedWorkflow ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Workflow कोड कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-black/60 border border-stone-800 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-52 leading-relaxed">
                  {workflowYaml}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
