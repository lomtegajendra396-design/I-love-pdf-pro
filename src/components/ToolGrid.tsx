import React from 'react';
import { CATEGORIES, ALL_TOOLS } from '../data/tools';
import { ToolCategory, ToolDefinition } from '../types';
import { ToolCard } from './ToolCard';
import { Layers, SearchX } from 'lucide-react';

interface ToolGridProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  searchQuery: string;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSelectTool,
}) => {
  // Filter tools based on category and search query
  const filteredTools = ALL_TOOLS.filter((tool) => {
    // Search match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.acceptedExtensions.some((ext) => ext.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    // Category match
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'popular') return Boolean(tool.isPopular);
    return tool.category === selectedCategory;
  });

  return (
    <section id="all-pdf-tools" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-semibold text-xs uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Complete Collection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            All PDF Tools ({filteredTools.length})
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Select any tool below to begin processing your documents instantly.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm shadow-red-500/20 font-semibold'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-300 max-w-lg mx-auto">
          <SearchX className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900">No matching tools found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
            We couldn't find any tools matching "{searchQuery}". Try searching for Merge, Split, or Compress.
          </p>
        </div>
      )}
    </section>
  );
};
