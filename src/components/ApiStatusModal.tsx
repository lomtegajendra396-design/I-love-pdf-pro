import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Server,
  Cloud,
} from 'lucide-react';
import { ApiStatus } from '../types';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiStatus: ApiStatus | null;
  onRefreshStatus: () => Promise<void>;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({
  isOpen,
  onClose,
  apiStatus,
  onRefreshStatus,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshStatus();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">
                iLovePDF API & Deployment
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Backend credentials security and Render deployment setup
            </p>
          </div>
        </div>

        {/* Current Connection Status Box */}
        <div
          className={`p-5 rounded-2xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            apiStatus?.configured
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {apiStatus?.configured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">
                {apiStatus?.configured
                  ? 'iLovePDF Credentials Configured'
                  : 'API Credentials Needed in Backend Environment'}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {apiStatus?.configured
                  ? 'Your backend has valid API keys loaded. Document processing operations are active.'
                  : 'Add ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY to your server to process documents.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-xl shrink-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
            <span>Check Status</span>
          </button>
        </div>

        {/* Zero Client Exposure Security Callout */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 mb-6 flex items-start gap-3 text-xs text-zinc-600">
          <ShieldCheck className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-zinc-900">Strict Server-Only Security:</span>
            {' '}The iLovePDF API keys are read exclusively inside Node.js (<code className="bg-zinc-200 px-1 py-0.5 rounded font-mono text-zinc-800">process.env</code>). They are <strong>never</strong> bundled into frontend JavaScript, HTML, or exposed to browser DevTools.
          </div>
        </div>

        {/* Required Environment Variables Section */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
            Required Server Environment Variables
          </h4>

          {/* Variable 1 */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
            <div className="overflow-hidden">
              <span className="font-mono font-bold text-zinc-900">ILOVEPDF_PUBLIC_KEY</span>
              <p className="text-zinc-500 text-[11px] truncate">
                Public project key from iLovePDF developer console
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  apiStatus?.publicKeyConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {apiStatus?.publicKeyConfigured ? 'Active' : 'Missing'}
              </span>
              <button
                onClick={() => handleCopy('ILOVEPDF_PUBLIC_KEY', 'pub')}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 bg-white border border-zinc-200 rounded-lg cursor-pointer"
                title="Copy variable name"
              >
                {copiedKey === 'pub' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Variable 2 */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
            <div className="overflow-hidden">
              <span className="font-mono font-bold text-zinc-900">ILOVEPDF_SECRET_KEY</span>
              <p className="text-zinc-500 text-[11px] truncate">
                Secret project key (JWT authentication engine)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  apiStatus?.secretKeyConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {apiStatus?.secretKeyConfigured ? 'Active' : 'Missing'}
              </span>
              <button
                onClick={() => handleCopy('ILOVEPDF_SECRET_KEY', 'sec')}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 bg-white border border-zinc-200 rounded-lg cursor-pointer"
                title="Copy variable name"
              >
                {copiedKey === 'sec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Render Deployment & Setup Guide */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-zinc-500" />
            <span>Deploying to Render</span>
          </h4>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600 space-y-2.5">
            <p>
              1. Get your free keys at{' '}
              <a
                href="https://developer.ilovepdf.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-semibold underline inline-flex items-center gap-0.5"
              >
                developer.ilovepdf.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              (includes 250 free tasks per month).
            </p>
            <p>
              2. In your <strong>Render Dashboard</strong>, navigate to your Web Service and select the <strong>Environment</strong> tab.
            </p>
            <p>
              3. Add <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">ILOVEPDF_PUBLIC_KEY</code> and <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">ILOVEPDF_SECRET_KEY</code> with your keys.
            </p>
            <p>
              4. Render automatically supplies <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">PORT</code>, which our server binds to automatically.
            </p>
          </div>
        </div>

        {/* Local .env instructions */}
        <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-200 text-xs font-mono mb-6">
          <p className="text-zinc-400 mb-2">// In your root .env file:</p>
          <p className="text-emerald-400">ILOVEPDF_PUBLIC_KEY=project_public_xxxxxxxxxxxx</p>
          <p className="text-emerald-400">ILOVEPDF_SECRET_KEY=secret_key_xxxxxxxxxxxx</p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <a
            href="https://developer.ilovepdf.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            <span>Open iLovePDF Developer Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
