import React from 'react';
import { Search, Sparkles, Shield, Clock, Zap, FileCheck2 } from 'lucide-react';
import { POPULAR_TOOL_IDS, ALL_TOOLS } from '../data/tools';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTool: (toolId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTool,
}) => {
  const popularTools = ALL_TOOLS.filter((t) => POPULAR_TOOL_IDS.includes(t.id));

  return (
    <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-zinc-50 via-white to-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-red-600" />
          <span>Complete Suite of 23 Professional PDF Utilities</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Every tool you need to work with <span className="text-red-600">PDFs</span> in one place
        </h1>

        {/* Subhead */}
        <p className="mt-4 sm:mt-6 text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
          100% free, fast, and secure PDF tools powered by the robust iLovePDF REST engine.
          Merge, split, compress, convert, watermark, and protect your files effortlessly.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search PDF tools (e.g. Merge, Compress, Protect, Watermark)..."
              className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base text-zinc-900 bg-white border border-zinc-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-xs font-semibold text-zinc-400 hover:text-zinc-700 bg-zinc-100 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Popular Tools Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-zinc-500 mr-1 uppercase tracking-wider">
            Popular:
          </span>
          {popularTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-zinc-700 border border-zinc-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50/50 shadow-xs transition-all cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-red-500" />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>

        {/* Feature/Trust Micro-Badges */}
        <div className="mt-10 pt-8 border-t border-zinc-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="flex items-start gap-3 p-2">
            <div className="p-2 rounded-lg bg-red-50 text-red-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900">Instant Processing</h4>
              <p className="text-xs text-zinc-500">Fast cloud execution via direct iLovePDF clusters</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900">Zero Retention Guarantee</h4>
              <p className="text-xs text-zinc-500">Files automatically erased immediately after processing</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900">100% Free & Unlimited</h4>
              <p className="text-xs text-zinc-500">No account required to upload and process files</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
