import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ToolDefinition } from '../types';
import { ToolIcon } from './IconHelper';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (tool: ToolDefinition) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  return (
    <div
      id={`tool-card-${tool.id}`}
      onClick={() => onSelect(tool)}
      className={`group relative flex flex-col justify-between p-5 sm:p-6 bg-white rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
        tool.supportedByApi
          ? 'border-zinc-200 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-0.5'
          : 'border-zinc-200/90 bg-zinc-50/40 hover:border-amber-300 hover:bg-white'
      }`}
    >
      <div>
        {/* Top bar: Icon and Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              tool.supportedByApi
                ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                : 'bg-zinc-100 text-zinc-500 group-hover:bg-amber-100 group-hover:text-amber-700'
            }`}
          >
            <ToolIcon name={tool.iconName} className="w-6 h-6 stroke-[2]" />
          </div>

          <div>
            {tool.supportedByApi ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Active API
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                API Unavailable
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Card Footer: Action arrow or Notice */}
      <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold">
        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">
          {tool.acceptedExtensions.join(' • ')}
        </span>

        <div
          className={`flex items-center gap-1 transition-transform group-hover:translate-x-1 ${
            tool.supportedByApi ? 'text-red-600' : 'text-zinc-400 group-hover:text-amber-600'
          }`}
        >
          <span>{tool.supportedByApi ? 'Open Tool' : 'API Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
