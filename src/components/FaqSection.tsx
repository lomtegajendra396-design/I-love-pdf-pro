import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Are my uploaded files secure and private?',
      answer:
        'Yes, absolutely. Security and privacy are paramount. Your files are encrypted in transit via HTTPS, processed strictly in isolated temporary storage, and automatically deleted from the server immediately upon completion. We do not store, view, or retain your files.',
    },
    {
      question: 'How does the iLovePDF API integration work?',
      answer:
        'All PDF tasks (merging, splitting, compression, image conversion, OCR, watermarking, protection, repair) are processed via the official iLovePDF REST API. Our Express backend manages JWT authentication and task pipelines using the ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY server-side environment variables.',
    },
    {
      question: 'Why are some tools labeled "API Unavailable"?',
      answer:
        'The public iLovePDF developer REST API provides endpoints for Office-to-PDF, Image-to-PDF, HTML-to-PDF, and manipulation tasks, but does not provide an endpoint for reverse export (e.g. PDF to Word/Excel/PowerPoint). In accordance with our zero-fake-results policy, we never fake conversions with corrupted files; instead, we indicate true API availability and provide working alternatives.',
    },
    {
      question: 'How do I deploy this application to Render?',
      answer:
        'PDF Tools Pro is engineered for 1-click deployment on Render. It reads the PORT environment variable provided by Render, runs production builds via esbuild, and serves the optimized Vite frontend seamlessly from Express. Just add ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY in your Render dashboard environment tab.',
    },
    {
      question: 'Where can I get free iLovePDF API credentials?',
      answer:
        'You can register for a free developer account at developer.ilovepdf.com. Every free account comes with 250 free processing tasks every month, which is ideal for testing and personal productivity.',
    },
    {
      question: 'What are the file size and batch limitations?',
      answer:
        'You can upload files up to 50MB each. Batch tools like Merge PDF and Image to PDF allow uploading up to 10 files in a single operation.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-3 border border-red-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Everything you need to know about PDF Tools Pro, privacy, and API integration.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
