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
import { buildApiUrl, getSavedBackendUrl, setCustomBackendUrl } from '../utils/api';

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
  const [customBackend, setCustomBackend] = useState<string>(getSavedBackendUrl());
  const [backendSaveMsg, setBackendSaveMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRenderHost = typeof window !== 'undefined' && window.location.hostname.includes('render.com');
  const isCloudRunHost = typeof window !== 'undefined' && window.location.hostname.includes('run.app');
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
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

  const handleSaveBackend = async () => {
    setCustomBackendUrl(customBackend);
    setBackendSaveMsg('Saved! Refreshing status...');
    await onRefreshStatus();
    setTimeout(() => setBackendSaveMsg(null), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(buildApiUrl('/api/test-connection'));
      const data = await res.json();
      setTestResult(data);
      await onRefreshStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Could not connect to backend test endpoint.',
        details: err.message,
        guidance: isGitHubPages
          ? 'GitHub Pages only serves static files. If your backend is deployed on Google Cloud Run or Render, enter its full URL below.'
          : 'Make sure your Node.js backend server is running and accessible.',
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

        {/* Host Awareness Notice */}
        {isGitHubPages && (
          <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 mb-6 text-xs text-blue-900">
            <div className="flex items-start gap-2.5">
              <Cloud className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="w-full space-y-2">
                <p className="font-bold text-sm">GitHub Pages Static Deployment Active</p>
                <p className="leading-relaxed text-blue-800">
                  GitHub Pages hosts your static React frontend (at <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">/I-love-pdf-pro/</code>). To execute live PDF transformations using your iLovePDF keys, connect your deployed Google Cloud Run or Render backend API:
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://your-backend-app.run.app (or onrender.com)"
                    value={customBackend}
                    onChange={(e) => setCustomBackend(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveBackend}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Connect Backend
                  </button>
                </div>
                {backendSaveMsg && (
                  <p className="text-emerald-700 font-semibold">{backendSaveMsg}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!isGitHubPages && !isRenderHost && !isCloudRunHost && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 mb-6 text-xs text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Current Environment: {currentHost}</p>
                <p className="mt-1 leading-relaxed text-amber-800">
                  When deployed to Google Cloud Run, Render, or GitHub Pages, your API keys configured in the server environment will be utilized automatically.
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

        {/* Deployment Instructions for Cloud Run & Render */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-red-600" />
            <span>Google Cloud Run Deployment Instructions</span>
          </h4>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-700 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">1.</span>
              <p>
                <strong>Google Cloud Console:</strong> Go to <a href="https://console.cloud.google.com/run" target="_blank" rel="noreferrer" className="text-red-600 underline font-semibold">Cloud Run</a> and click <strong>"Create Service"</strong> (or deploy via GitHub repo).
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">2.</span>
              <p>
                <strong>Authentication:</strong> Under "Authentication", check <strong>"Allow unauthenticated invocations"</strong> so public users can access the website.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">3.</span>
              <p>
                <strong>Environment Variables:</strong> Under <em>"Containers, Networking, Security" &gt; "Variables &amp; Secrets"</em>, add:
                <br />
                • <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">ILOVEPDF_PUBLIC_KEY</code> = <span className="text-zinc-600">your public key</span>
                <br />
                • <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">ILOVEPDF_SECRET_KEY</code> = <span className="text-zinc-600">your secret key</span>
                <br />
                • <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">NODE_ENV</code> = <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">production</code>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-red-600 shrink-0">4.</span>
              <p>
                <strong>Port Configuration:</strong> Container listens automatically on <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">process.env.PORT</code> (default 8080 on Cloud Run, 3000 in AI Studio) bound to <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono">0.0.0.0</code>.
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
