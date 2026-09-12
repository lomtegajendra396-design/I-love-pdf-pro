import React from 'react';
import { FileText, ShieldCheck, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { ApiStatus } from '../types';

interface HeaderProps {
  apiStatus: ApiStatus | null;
  onOpenApiModal: () => void;
  onSelectTool: (toolId: string) => void;
  onGoHome: () => void;
  activeToolId: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  onOpenApiModal,
  onSelectTool,
  onGoHome,
  activeToolId,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome} id="brand-logo">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-500/20">
              <FileText className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-zinc-900">
                  PDF Tools <span className="text-red-600">Pro</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  iLovePDF Engine
                </span>
              </div>
              <p className="text-xs text-zinc-500 hidden md:block">
                Free Online PDF Tools
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-600">
            <button
              onClick={onGoHome}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                !activeToolId ? 'text-red-600 bg-red-50 font-semibold' : 'hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => onSelectTool('merge')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeToolId === 'merge' ? 'text-red-600 bg-red-50 font-semibold' : 'hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Merge PDF
            </button>
            <button
              onClick={() => onSelectTool('split')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeToolId === 'split' ? 'text-red-600 bg-red-50 font-semibold' : 'hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Split PDF
            </button>
            <button
              onClick={() => onSelectTool('compress')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeToolId === 'compress' ? 'text-red-600 bg-red-50 font-semibold' : 'hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Compress PDF
            </button>
            <button
              onClick={() => onSelectTool('word-to-pdf')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeToolId === 'word-to-pdf' ? 'text-red-600 bg-red-50 font-semibold' : 'hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Word to PDF
            </button>
            <button
              onClick={() => onSelectTool('jpg-to-pdf')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeToolId === 'jpg-to-pdf' ? 'text-red-600 bg-red-50 font-semibold' : 'hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              JPG to PDF
            </button>
          </nav>

          {/* Right Action: API Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="api-status-btn"
              onClick={onOpenApiModal}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all ${
                apiStatus?.configured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-sm'
              }`}
              title="Click to view backend API credentials & deployment status"
            >
              {apiStatus?.configured ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 hidden sm:inline" />
                  <span>API Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold">Setup API Keys</span>
                  <KeyRound className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
                </>
              )}
            </button>

            {/* Quick Home if inside workspace */}
            {activeToolId && (
              <button
                onClick={onGoHome}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
