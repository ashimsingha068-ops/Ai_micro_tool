import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-black/10 gap-6">
      {/* Left side 3 words in 3 rows in bold Roboto */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-left font-roboto select-none group">
          <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-black">
            AI
          </span>
          <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-black my-0.5">
            Micro
          </span>
          <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-black">
            Tool
          </span>
        </div>

        <div className="h-16 w-[2px] bg-black/15 hidden sm:block mx-2" />

        <div className="hidden sm:flex flex-col text-left justify-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-black/60 font-roboto">
            <Zap className="w-3.5 h-3.5 text-black" />
            <span>SEO Creator Engine</span>
          </div>
          <p className="text-sm font-medium text-black/80 font-roboto max-w-xs mt-0.5 leading-snug">
            Fast, high-CTR titles, engaging bios & viral hashtags for modern content creators.
          </p>
        </div>
      </div>

      {/* Right side status badges */}
      <div className="flex items-center gap-3 self-end sm:self-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/20 text-xs font-medium text-black bg-white shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gemini 3.7 AI Active</span>
        </div>
        <div className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-black/20 text-xs font-medium text-black/70 bg-white">
          <ShieldCheck className="w-3.5 h-3.5 text-black" />
          <span>SEO Optimized</span>
        </div>
      </div>
    </header>
  );
};
