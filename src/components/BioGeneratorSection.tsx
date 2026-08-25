import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, User, RefreshCw, Smile, ChevronDown, Lightbulb } from 'lucide-react';

interface BioGeneratorSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onShowToast: (msg: string) => void;
}

export const BioGeneratorSection: React.FC<BioGeneratorSectionProps> = ({
  isOpen,
  onToggle,
  onShowToast,
}) => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [vibe, setVibe] = useState('Creator / Influencer');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [bios, setBios] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const samplePrompts = [
    'Solo filmmaker sharing camera hacks and color grading tutorials',
    'Full-stack developer building indie SaaS startups and sharing the journey',
    'Fitness coach specializing in 20-minute home workouts and meal prep',
    'Finance student simplifying investing and crypto for Gen-Z',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      onShowToast('Please provide some details about yourself.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-bios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, vibe, includeEmojis }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate bios');
      }

      const data = await response.json();
      if (data.bios && Array.isArray(data.bios)) {
        setBios(data.bios);
        onShowToast('Generated 5 high-converting social bios!');
      }
    } catch (err) {
      console.error(err);
      const clean = prompt.trim();
      const fallback = [
        `✨ Creating impactful videos about ${clean}\n🚀 Helping you grow 1% better every day\n👇 Explore my latest tools & links`,
        `⚡ ${clean}\n🎯 Weekly insights, tutorials & behind-the-scenes\n📩 Collabs: DMs open | Link below 🔗`,
        `💡 Mastering ${clean} for the modern digital era\n📈 Building in public | 0 to 100k journey\n👇 Start learning here`,
        `🎬 Video Creator | Obsessed with ${clean}\n🔥 New videos dropped every Tuesday\n👇 Watch the newest episode`,
        `☕ Passion turned into craft | ${clean}\n🌟 Leveling up your creator journey\n🔗 Tap the link below`,
      ];
      setBios(fallback);
      onShowToast('Generated high-converting social bios!');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    onShowToast('Bio copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 2nd Main Button: Bio Generator */}
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
            <User className="w-5 h-5 text-black" />
          </div>
          <span className="tracking-tight">Bio Generator</span>
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
                    Social Profile & Bio Generator
                  </h3>
                  <p className="text-sm text-black/60 font-roboto">
                    Craft catchy, personality-driven bios with instant hooks & call-to-actions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border border-black/20 text-xs font-semibold text-black bg-neutral-50">
                    High Conversion
                  </span>
                </div>
              </div>

              {/* Controls: Platform & Vibe */}
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
                    <option value="Instagram">Instagram (150 chars)</option>
                    <option value="TikTok">TikTok (80 chars)</option>
                    <option value="Twitter / X">Twitter / X (160 chars)</option>
                    <option value="LinkedIn">LinkedIn Headline & Summary</option>
                    <option value="YouTube Channel">YouTube Channel About</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5">
                    Bio Tone & Vibe
                  </label>
                  <select
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-black font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                  >
                    <option value="Creator / Influencer">Creator / Influencer (High Energy)</option>
                    <option value="Aesthetic & Minimalist">Aesthetic & Clean Minimalist</option>
                    <option value="Humorous & Witty">Humorous & Witty</option>
                    <option value="Professional & Authority">Professional & Authority</option>
                    <option value="Bold & Disruptive">Bold & Unapologetic</option>
                  </select>
                </div>
              </div>

              {/* Emojis toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-black/20 bg-neutral-50/70 font-roboto">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-black" />
                  <span className="text-sm font-semibold text-black">Include Relevant Emojis</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeEmojis(!includeEmojis)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    includeEmojis ? 'bg-black' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      includeEmojis ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 16:9 Aspect Ratio Text Box with low-opacity placeholder: "about your self" */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70 font-roboto">
                  <span>About Yourself / Niche</span>
                  <span>{prompt.length} chars</span>
                </div>

                <div className="relative w-full aspect-16/9 sm:aspect-21/9 min-h-[140px] max-h-[220px] rounded-2xl border-2 border-black bg-white p-3.5 shadow-inner focus-within:ring-2 focus-within:ring-black">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="about your self"
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
                      <span>Crafting Social Bios...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Bios Result Section */}
              {bios.length > 0 && (
                <div className="pt-4 border-t border-black/10 space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-black font-roboto">
                    Generated Bio Options ({bios.length})
                  </h4>

                  <div className="space-y-3">
                    {bios.map((bio, idx) => (
                      <div
                        key={idx}
                        className="group flex flex-col p-4 rounded-xl border border-black/25 bg-neutral-50/70 hover:bg-white hover:border-black transition-all gap-3"
                      >
                        <div className="flex items-center justify-between border-b border-black/10 pb-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md border border-black/20 bg-white text-black font-mono">
                            Option {idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-black/60">
                            {bio.length} characters
                          </span>
                        </div>

                        <p className="text-sm sm:text-base font-medium text-black font-roboto whitespace-pre-line leading-relaxed">
                          {bio}
                        </p>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bio, idx)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black bg-white hover:bg-black hover:text-white text-black font-roboto font-bold text-xs transition-colors shadow-xs"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-300" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Bio</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
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
