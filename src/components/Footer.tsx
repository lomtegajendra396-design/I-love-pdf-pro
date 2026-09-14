import React from 'react';
import { FileText, Shield, Heart, Cloud, Lock } from 'lucide-react';

interface FooterProps {
  onSelectTool: (toolId: string) => void;
  onGoHome: () => void;
  onOpenApiModal: () => void;
  onOpenLegalModal: (type: 'privacy' | 'terms' | 'about' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTool,
  onGoHome,
  onOpenApiModal,
  onOpenLegalModal,
}) => {
  return (
    <footer className="bg-zinc-900 text-zinc-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
                <FileText className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                PDF Tools <span className="text-red-500">Pro</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              PDF Tools Pro is a complete, modern suite of 23 online PDF tools. Fast, secure, and powered by the robust iLovePDF REST API.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-700">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero File Retention</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-700">
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Render Ready</span>
              </span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('merge')} className="hover:text-white transition-colors cursor-pointer">
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('split')} className="hover:text-white transition-colors cursor-pointer">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('compress')} className="hover:text-white transition-colors cursor-pointer">
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('word-to-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Word to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('pdf-to-jpg')} className="hover:text-white transition-colors cursor-pointer">
                  PDF to JPG
                </button>
              </li>
            </ul>
          </div>

          {/* Convert Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Convert & Edit
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('jpg-to-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  JPG to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('png-to-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  PNG to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('rotate')} className="hover:text-white transition-colors cursor-pointer">
                  Rotate PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('watermark')} className="hover:text-white transition-colors cursor-pointer">
                  Watermark PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('page-numbers')} className="hover:text-white transition-colors cursor-pointer">
                  Page Numbers
                </button>
              </li>
            </ul>
          </div>

          {/* Security & System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onOpenLegalModal('about')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('contact')} 
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('privacy')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('terms')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li className="pt-2 border-t border-zinc-800">
                <button onClick={onOpenApiModal} className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer text-left">
                  API Key Setup
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} PDF Tools Pro. All rights reserved.</p>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <button onClick={() => onOpenLegalModal('privacy')} className="hover:text-zinc-300 transition-colors">Privacy</button>
            <button onClick={() => onOpenLegalModal('terms')} className="hover:text-zinc-300 transition-colors">Terms</button>
            <button onClick={() => onOpenLegalModal('contact')} className="hover:text-zinc-300 transition-colors">Contact</button>
          </div>
          <p className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Files are encrypted and securely erased immediately after processing.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
