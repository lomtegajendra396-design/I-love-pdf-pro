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
  Zap,
  HelpCircle,
} from 'lucide-react';
import { ApiStatus, ConnectionTestResult } from '../types';

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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  if (!isOpen) return null;

  const isRenderHost = typeof window !== 'undefined' && window.location.hostname.includes('render.com');
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

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

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-connection');
      const data = await res.json();
      setTestResult(data);
      await onRefreshStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Could not connect to backend test endpoint.',
        details: err.message,
      });
    } finally {
      setIsTesting(false);
    }
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
              Backend credentials diagnostics and Render deployment status
            </p>
          </div>
        </div>

        {/* Host Awareness Notice (Crucial for users testing in preview instead of Render URL) */}
        {!isRenderHost && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 mb-6 text-xs text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Aap abhi Preview Window par hain ({currentHost})</p>
                <p className="mt-1 leading-relaxed text-amber-800">
                  Agar aapne API keys apne <strong>Render Dashboard</strong> me set ki hain, to woh keys aapki <strong>Live Render Website</strong> par apply hoti hain (jaise <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">https://&lt;your-app&gt;.onrender.com</code>). 
                  Render wali live URL open karke wahan test karein!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Connection Status Box */}
        <div
          className={`p-5 rounded-2xl border mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
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
                  ? 'iLovePDF Keys Detected in Server Environment'
                  : 'API Keys Missing in This Server Environment'}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {apiStatus?.configured
                  ? 'Server has both Public & Secret keys loaded. Click Test Connection to verify with iLovePDF.'
                  : 'Add ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY in server environment variables.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-xl shrink-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shrink-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Live Test Connection Result */}
        {testResult && (
          <div
            className={`p-4 rounded-2xl border mb-6 text-xs transition-all ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {testResult.success ? 'iLovePDF Handshake Successful!' : 'iLovePDF Handshake Failed'}
                </p>
                <p className="leading-relaxed">{testResult.message}</p>
                {testResult.guidance && (
                  <p className="font-medium text-zinc-700 mt-1">
                    👉 <strong>Remedy:</strong> {testResult.guidance}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quotes Warning if detected */}
        {apiStatus?.hasQuotes && (
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 mb-6 text-xs text-orange-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <strong>Quotes warning:</strong> Extra quotation marks were detected around your keys. Ensure you do NOT type quotation marks (<code className="bg-orange-100 px-1 py-0.5 rounded font-mono">"..."</code>) in the Render Environment values.
            </div>
          </div>
        )}

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
                Starts with <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">project_public_...</code>
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
                Starts with <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">secret_key_...</code>
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

        {/* Render Troubleshooting Checklist */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-red-600" />
            <span>Agar Render par "Failed" aa raha hai to ye 4 baatein check karein:</span>
          </h4>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-700 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">1.</span>
              <p>
                <strong>Keys Swap to nahi hui?</strong> Render me <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">ILOVEPDF_PUBLIC_KEY</code> me <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">project_public_...</code> hona chahiye aur <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">ILOVEPDF_SECRET_KEY</code> me <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">secret_key_...</code> hona chahiye.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">2.</span>
              <p>
                <strong>No quotes or extra spaces:</strong> Key ke aage-peeche quotation marks (<code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">"..."</code>) ya space mat daalein.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">3.</span>
              <p>
                <strong>Render Deploy status "Live":</strong> Render dashboard me check karein ki naya build complete hoke status <strong>"Live" (Green)</strong> hai ya nahi. Agar deploy chal raha hai, to wait karein.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">4.</span>
              <p>
                <strong>iLovePDF Account Verification:</strong> <a href="https://developer.ilovepdf.com" target="_blank" rel="noreferrer" className="text-red-600 underline font-semibold">developer.ilovepdf.com</a> par login karke check karein ki aapka email verified hai aur monthly free tasks (250 tasks) available hain.
              </p>
            </div>
          </div>
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
