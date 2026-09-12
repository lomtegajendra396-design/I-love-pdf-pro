import React from 'react';
import { Upload, SlidersHorizontal, DownloadCloud, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Select Tool & Upload Files',
      description:
        'Choose any of the 23 tools from our dashboard. Drag and drop your PDFs or documents directly from your desktop or phone.',
      icon: Upload,
    },
    {
      number: '02',
      title: 'Customize Processing Options',
      description:
        'Tailor options to your needs: choose compression level, specify page ranges to split, configure watermark text, or set strong passwords.',
      icon: SlidersHorizontal,
    },
    {
      number: '03',
      title: 'Instant Download & Auto-Cleanup',
      description:
        'Our server streams your job through the high-speed iLovePDF engine. Download your output immediately while temporary files are automatically purged.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="py-16 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-3 border border-red-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            How PDF Tools Pro Works
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Powerful cloud document manipulation executed in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-2xl font-black text-zinc-300 font-mono">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
