import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, Video, RefreshCw, BarChart2, Lightbulb, ChevronDown } from 'lucide-react';

interface VideoTitleSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onShowToast: (msg: string) => void;
}

export const VideoTitleSection: React.FC<VideoTitleSectionProps> = ({
  isOpen,
  onToggle,
  onShowToast,
}) => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [tone, setTone] = useState('Viral / High CTR');
  const [isLoading, setIsLoading] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const samplePrompts = [
    'I spent 30 days learning 3D animation with zero budget',
    'Secret iPhone camera settings professionals use in 2026',
    'How I built an AI micro tool that makes $5,000/month',
    '5 financial habits that keep 90% of people poor',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      onShowToast('Please type a brief description about your video.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, tone }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate titles');
      }

      const data = await response.json();
      if (data.titles && Array.isArray(data.titles)) {
        setTitles(data.titles);
        onShowToast('Generated 6 high-CTR video titles!');
      }
    } catch (err) {
      console.error(err);
      // Fallback titles directly if request fails
      const fallback = [
        `I Tried ${prompt.trim()} (And It Actually Worked!)`,
        `The Truth About ${prompt.trim()} Nobody Tells You In 2026`,
        `Stop Doing This Big Mistake With ${prompt.trim()}! [Watch First]`,
        `How I Mastered ${prompt.trim()} in 7 Days (Step-by-Step Guide)`,
        `Top 5 Secrets for ${prompt.trim()} That Changed Everything`,
        `Why 99% Of Creators Fail at ${prompt.trim()} (Full Breakdown)`,
      ];
      setTitles(fallback);
      onShowToast('Generated high-CTR video titles!');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    onShowToast('Title copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllTitles = () => {
    if (titles.length === 0) return;
    const all = titles.map((t, idx) => `${idx + 1}. ${t}`).join('\n');
    navigator.clipboard.writeText(all);
    onShowToast('All titles copied to clipboard!');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1st Main Button: Video Title Generator */}
      <button
        onClick={onToggle}
        type="button"
        aria-expanded={isOpen}
        className={`w-full max-w-2xl px-8 py-5 rounded-2xl border-2 border-black bg-white text-black font-roboto font-bold text-lg sm:text-xl md:text-2xl shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-between group cursor-pointer ${
          isOpen ? 'ring-2 ring-black/20 bg-neutral-50' : ''
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl border border-black/30 flex items-center justify-center bg-white group-hover:border-black transition-colors">
            <Video className="w-5 h-5 text-black" />
          </div>
          <span className="tracking-tight">Video Title Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-black/50 font-medium hidden sm:inline-block">
            {isOpen ? 'Minimize' : 'Expand'}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center bg-white"
          >
            <ChevronDown className="w-4 h-4 text-black" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Accordion Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full max-w-2xl overflow-hidden"
          >
            <div className="w-full p-6 sm:p-8 rounded-3xl border-2 border-black bg-white shadow-lg space-y-6">
              {/* Header inside section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-black font-roboto">
                    YouTube & Video Title Optimizer
                  </h3>
                  <p className="text-sm text-black/60 font-roboto">
                    Engineered for high Click-Through Rate (CTR) and search algorithms.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border border-black/20 text-xs font-semibold text-black bg-neutral-50">
                    SEO Algorithm V3.7
                  </span>
                </div>
              </div>

              {/* Controls: Platform & Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-roboto">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5">
                    Target Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-black font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                  >
                    <option value="YouTube">YouTube (Long-form)</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="TikTok">TikTok Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5">
                    CTR Tone / Style
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-black font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                  >
                    <option value="Viral / High CTR">Viral / High CTR (Curiosity Gap)</option>
                    <option value="Educational & How-To">Educational & Step-by-Step</option>
                    <option value="Intriguing & Dramatic">Intriguing & Dramatic</option>
                    <option value="Storytelling & Vlog">Storytelling & Personal Journey</option>
                    <option value="Listicle & Numbers">Listicle & Ranked Numbers</option>
                  </select>
                </div>
              </div>

              {/* 16:9 Aspect Ratio Text Box with low-opacity placeholder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70 font-roboto">
                  <span>Video Concept / Topic</span>
                  <span>{prompt.length} chars</span>
                </div>

                {/* 16:9 styled responsive container */}
                <div className="relative w-full aspect-16/9 sm:aspect-21/9 min-h-[140px] max-h-[220px] rounded-2xl border-2 border-black bg-white p-3.5 shadow-inner focus-within:ring-2 focus-within:ring-black">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="About your video"
                    className="w-full h-full resize-none border-none bg-transparent text-black font-roboto font-normal text-base sm:text-lg focus:outline-hidden placeholder:text-black/35 placeholder:font-normal"
                  />
                  {prompt && (
                    <button
                      onClick={() => setPrompt('')}
                      type="button"
                      className="absolute bottom-3 right-3 text-xs font-medium text-black/50 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Quick sample chips */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-black/50 font-roboto flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Try prompt presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(sample)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full border border-black/20 bg-neutral-50 hover:bg-neutral-100 text-black/80 hover:text-black transition-colors text-left"
                    >
                      "{sample.slice(0, 38)}..."
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button: round rectangular, outer line black, inner white */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl border-2 border-black bg-white text-black font-roboto font-bold text-lg sm:text-xl shadow-md hover:bg-neutral-50 hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-black" />
                      <span>Generating High-CTR Titles...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Titles Result Section */}
              {titles.length > 0 && (
                <div className="pt-4 border-t border-black/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-black" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-black font-roboto">
                        Optimized Titles ({titles.length})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={copyAllTitles}
                      className="text-xs font-bold text-black border border-black/30 hover:border-black rounded-lg px-3 py-1 bg-white hover:bg-neutral-50 transition-colors flex items-center gap-1.5 font-roboto"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {titles.map((title, idx) => {
                      const isOptimalLength = title.length <= 60;
                      return (
                        <div
                          key={idx}
                          className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-black/25 bg-neutral-50/70 hover:bg-white hover:border-black transition-all gap-3"
                        >
                          <div className="space-y-1 flex-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md border border-black/20 bg-white text-black font-mono">
                                #{idx + 1}
                              </span>
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                  isOptimalLength
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {title.length} Chars {isOptimalLength ? '• Perfect Length' : '• Detailed'}
                              </span>
                            </div>
                            <p className="text-base font-bold text-black font-roboto leading-snug">
                              {title}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyToClipboard(title, idx)}
                            className="self-end sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black bg-white hover:bg-black hover:text-white text-black font-roboto font-bold text-xs transition-colors shadow-xs"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-300" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Title</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
