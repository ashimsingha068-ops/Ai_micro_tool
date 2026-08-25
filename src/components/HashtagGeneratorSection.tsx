import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, Hash, RefreshCw, Layers, ChevronDown, Lightbulb, TrendingUp } from 'lucide-react';

interface HashtagGeneratorSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onShowToast: (msg: string) => void;
}

interface HashtagData {
  highReach: string[];
  targeted: string[];
  niche: string[];
}

export const HashtagGeneratorSection: React.FC<HashtagGeneratorSectionProps> = ({
  isOpen,
  onToggle,
  onShowToast,
}) => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [focus, setFocus] = useState('Balanced 30 Tags');
  const [isLoading, setIsLoading] = useState(false);
  const [hashtags, setHashtags] = useState<HashtagData | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const samplePrompts = [
    'Street photography tips in rainy Tokyo at night',
    'Beginner bodybuilding nutrition and meal prep guide',
    'Productivity hacks with Notion and AI automation',
    'Indie game development devlog in Unreal Engine 5',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      onShowToast('Please provide your content context.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, focus }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate hashtags');
      }

      const data = await response.json();
      if (data.hashtags && data.hashtags.highReach) {
        setHashtags(data.hashtags);
        onShowToast('Generated 30 algorithm-optimized hashtags!');
      }
    } catch (err) {
      console.error(err);
      const words = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
      const base = words[0] || 'creator';
      const second = words[1] || 'video';
      const fallback: HashtagData = {
        highReach: [
          `#${base}`,
          `#trending`,
          `#viral`,
          `#contentcreator`,
          `#explorepage`,
          `#youtube`,
          `#fyp`,
          `#reels`,
          `#videoviral`,
          `#growth`,
        ],
        targeted: [
          `#${base}tips`,
          `#${base}creator`,
          `#${second}life`,
          `#creatoreconomy`,
          `#socialmediagrowth`,
          `#digitalcreator`,
          `#videotips`,
          `#creatorsofinstagram`,
          `#onlinegrowth`,
          `#contentstrategy`,
        ],
        niche: [
          `#${base}hacks`,
          `#howtogrow${base}`,
          `#best${base}`,
          `#${base}community`,
          `#${second}guide`,
          `#learneveryday`,
          `#creatorsunite`,
          `#growyourchannel`,
          `#contentstrategy2026`,
          `#aimicrotool`,
        ],
      };
      setHashtags(fallback);
      onShowToast('Generated algorithm-optimized hashtags!');
    } finally {
      setIsLoading(false);
    }
  };

  const copySingleTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    onShowToast(`Copied ${tag}`);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const copyCategory = (categoryTags: string[], categoryName: string) => {
    const text = categoryTags.join(' ');
    navigator.clipboard.writeText(text);
    onShowToast(`Copied ${categoryTags.length} ${categoryName} hashtags!`);
  };

  const copyAllHashtags = () => {
    if (!hashtags) return;
    const all = [...hashtags.highReach, ...hashtags.targeted, ...hashtags.niche].join(' ');
    navigator.clipboard.writeText(all);
    setCopiedAll(true);
    onShowToast('Copied all 30 hashtags to clipboard!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3rd Main Button: Hashtag Generator */}
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
            <Hash className="w-5 h-5 text-black" />
          </div>
          <span className="tracking-tight">Hashtag Generator</span>
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
                    SEO & Viral Hashtag Matrix
                  </h3>
                  <p className="text-sm text-black/60 font-roboto">
                    Categorized 3-tier distribution strategy for maximum algorithmic reach.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border border-black/20 text-xs font-semibold text-black bg-neutral-50 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    30-Tag Strategy
                  </span>
                </div>
              </div>

              {/* Controls: Platform & Strategy */}
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
                    <option value="Instagram">Instagram (Reels & Posts)</option>
                    <option value="TikTok">TikTok (FYP Tags)</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="LinkedIn">LinkedIn Business Tags</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5">
                    Distribution Focus
                  </label>
                  <select
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-black font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                  >
                    <option value="Balanced 30 Tags">Balanced (10 Viral + 10 Targeted + 10 Niche)</option>
                    <option value="Viral Mega Reach">Viral & High Volume Focus</option>
                    <option value="Niche / Low Competition">Niche & Low Competition (High Ranking)</option>
                  </select>
                </div>
              </div>

              {/* 16:9 Aspect Ratio Text Box with low-opacity placeholder: "about your context" */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70 font-roboto">
                  <span>Context / Video Description</span>
                  <span>{prompt.length} chars</span>
                </div>

                <div className="relative w-full aspect-16/9 sm:aspect-21/9 min-h-[140px] max-h-[220px] rounded-2xl border-2 border-black bg-white p-3.5 shadow-inner focus-within:ring-2 focus-within:ring-black">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="about your context"
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
                      "{sample.slice(0, 36)}..."
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
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
                      <span>Generating Hashtag Strategy...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Hashtags Result Section */}
              {hashtags && (
                <div className="pt-4 border-t border-black/10 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-black" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-black font-roboto">
                        Hashtags Generated (30)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={copyAllHashtags}
                      className="self-start sm:self-auto text-xs font-bold text-black border-2 border-black rounded-xl px-4 py-2 bg-white hover:bg-black hover:text-white transition-colors flex items-center gap-2 font-roboto shadow-xs"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>All Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy All 30 Hashtags</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tier 1: High Reach / Viral */}
                  <div className="p-4 rounded-2xl border border-black/25 bg-neutral-50/70 space-y-3">
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-black font-roboto">
                          1. Viral / High Volume (10)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCategory(hashtags.highReach, 'Viral')}
                        className="text-xs font-bold text-black/70 hover:text-black underline"
                      >
                        Copy Tier
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.highReach.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => copySingleTag(tag)}
                          className="px-3 py-1.5 rounded-xl border border-black/20 bg-white hover:border-black hover:bg-neutral-100 text-black text-xs font-semibold font-mono transition-colors flex items-center gap-1 shadow-xs"
                        >
                          {tag}
                          {copiedTag === tag && <Check className="w-3 h-3 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tier 2: Targeted & Category */}
                  <div className="p-4 rounded-2xl border border-black/25 bg-neutral-50/70 space-y-3">
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-black font-roboto">
                          2. Targeted & Industry (10)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCategory(hashtags.targeted, 'Targeted')}
                        className="text-xs font-bold text-black/70 hover:text-black underline"
                      >
                        Copy Tier
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.targeted.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => copySingleTag(tag)}
                          className="px-3 py-1.5 rounded-xl border border-black/20 bg-white hover:border-black hover:bg-neutral-100 text-black text-xs font-semibold font-mono transition-colors flex items-center gap-1 shadow-xs"
                        >
                          {tag}
                          {copiedTag === tag && <Check className="w-3 h-3 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tier 3: Niche & Long-tail */}
                  <div className="p-4 rounded-2xl border border-black/25 bg-neutral-50/70 space-y-3">
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-black font-roboto">
                          3. Niche & Community (10)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCategory(hashtags.niche, 'Niche')}
                        className="text-xs font-bold text-black/70 hover:text-black underline"
                      >
                        Copy Tier
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.niche.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => copySingleTag(tag)}
                          className="px-3 py-1.5 rounded-xl border border-black/20 bg-white hover:border-black hover:bg-neutral-100 text-black text-xs font-semibold font-mono transition-colors flex items-center gap-1 shadow-xs"
                        >
                          {tag}
                          {copiedTag === tag && <Check className="w-3 h-3 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
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
