import React from 'react';
import { X, AlertTriangle, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { ToolDefinition } from '../types';
import { ToolIcon } from './IconHelper';

interface UnavailableToolModalProps {
  tool: ToolDefinition | null;
  onClose: () => void;
  onSelectAlternative: (toolId: string) => void;
}

export const UnavailableToolModal: React.FC<UnavailableToolModalProps> = ({
  tool,
  onClose,
  onSelectAlternative,
}) => {
  if (!tool) return null;

  // Choose appropriate alternative tool
  let alternativeId = 'word-to-pdf';
  let alternativeName = 'Word to PDF';
  if (tool.id.includes('excel')) {
    alternativeId = 'excel-to-pdf';
    alternativeName = 'Excel to PDF';
  } else if (tool.id.includes('powerpoint')) {
    alternativeId = 'powerpoint-to-pdf';
    alternativeName = 'PowerPoint to PDF';
  } else if (tool.id.includes('organize')) {
    alternativeId = 'split';
    alternativeName = 'Split PDF';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-1">
              API Status: Unavailable
            </div>
            <h3 className="text-xl font-bold text-zinc-900">
              {tool.name} Endpoint Not Available
            </h3>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
          <p className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs sm:text-sm text-zinc-700">
            {tool.unsupportedReason ||
              'The iLovePDF developer REST API does not provide a public endpoint for this specific operation.'}
          </p>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero-Fake Policy:</span> PDF Tools Pro adheres strictly to honest engineering. We never fake conversion results or return corrupt placeholders.
            </div>
          </div>
        </div>

        {/* Recommended Alternative */}
        <div className="mt-6 pt-5 border-t border-zinc-100">
          <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">
            Available Supported Alternative:
          </p>
          <button
            onClick={() => {
              onClose();
              onSelectAlternative(alternativeId);
            }}
            className="w-full p-3.5 rounded-2xl bg-zinc-50 hover:bg-red-50 border border-zinc-200 hover:border-red-200 flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div>
              <p className="text-sm font-bold text-zinc-900 group-hover:text-red-600">
                Use {alternativeName}
              </p>
              <p className="text-xs text-zinc-500">
                Fully operational with direct iLovePDF API processing.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
