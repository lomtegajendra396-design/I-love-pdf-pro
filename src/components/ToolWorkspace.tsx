import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  File,
  X,
  ArrowLeft,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  HelpCircle,
  Plus,
  RefreshCw,
  Globe,
  FileType,
} from 'lucide-react';
import { ToolDefinition, UploadedFileItem, ToolOptions, ApiStatus } from '../types';
import { ToolIcon } from './IconHelper';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  apiStatus: ApiStatus | null;
  onBack: () => void;
  onOpenApiModal: () => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  apiStatus,
  onBack,
  onOpenApiModal,
}) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [htmlUrl, setHtmlUrl] = useState('');
  const [options, setOptions] = useState<ToolOptions>({
    compression_level: 'recommended',
    split_mode: 'ranges',
    ranges: '1-2',
    fixed_range: 1,
    remove_pages: '',
    rotate: 90,
    watermark_text: 'CONFIDENTIAL',
    vertical_position: 'middle',
    horizontal_position: 'center',
    font_size: 36,
    watermark_rotation: 45,
    transparency: 50,
    page_position: 'bottom-right',
    starting_number: 1,
    password: '',
    confirmPassword: '',
    filePassword: '',
    ocr_language: 'eng',
    orientation: 'portrait',
    margin: 0,
    pagesize: 'fit',
    pdfjpg_mode: 'pages',
    dpi: 150,
    page_size: 'A4',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('');
  const [resultFileSize, setResultFileSize] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMissingCredentials, setIsMissingCredentials] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Clean up previous blob URL when component unmounts or resets
  useEffect(() => {
    return () => {
      if (resultBlobUrl) {
        URL.revokeObjectURL(resultBlobUrl);
      }
    };
  }, [resultBlobUrl]);

  // Handle file addition
  const handleAddFiles = (newFileList: FileList | null) => {
    if (!newFileList || newFileList.length === 0) return;
    setErrorMsg(null);

    const validNewItems: UploadedFileItem[] = [];
    for (let i = 0; i < newFileList.length; i++) {
      const file = newFileList[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      // Validate extension
      if (!tool.acceptedExtensions.includes(ext)) {
        setErrorMsg(
          `Invalid file '${file.name}'. Only ${tool.acceptedExtensions.join(', ')} files are supported for ${tool.name}.`
        );
        return;
      }

      // Check max file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMsg(`File '${file.name}' exceeds the 50MB maximum size limit.`);
        return;
      }

      validNewItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatBytes(file.size),
        rotation: 0,
      });
    }

    if (tool.maxFiles === 1) {
      setFiles(validNewItems.slice(0, 1));
    } else {
      setFiles((prev) => {
        const combined = [...prev, ...validNewItems];
        if (combined.length > tool.maxFiles) {
          setErrorMsg(`A maximum of ${tool.maxFiles} files can be uploaded for ${tool.name}.`);
          return combined.slice(0, tool.maxFiles);
        }
        return combined;
      });
    }
  };

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Remove a single file
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setErrorMsg(null);
  };

  // Move file in sequence (for Merge)
  const handleMoveFile = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= files.length) return;
    setFiles((prev) => {
      const copy = [...prev];
      const item = copy.splice(fromIndex, 1)[0];
      copy.splice(toIndex, 0, item);
      return copy;
    });
  };

  // Reset workspace
  const handleReset = () => {
    setFiles([]);
    setHtmlUrl('');
    setIsProcessing(false);
    setUploadProgress(0);
    setProcessingStep('');
    if (resultBlobUrl) {
      URL.revokeObjectURL(resultBlobUrl);
    }
    setResultBlobUrl(null);
    setResultFileName('');
    setResultFileSize(0);
    setErrorMsg(null);
    setIsMissingCredentials(false);
  };

  // Trigger file download
  const handleTriggerDownload = () => {
    if (!resultBlobUrl || !resultFileName) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = resultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Execute processing via backend
  const handleProcess = async () => {
    setErrorMsg(null);
    setIsMissingCredentials(false);

    // Validation
    if (tool.id === 'html-to-pdf' && !files.length && !htmlUrl.trim()) {
      setErrorMsg('Please provide either an HTML file or a valid URL.');
      return;
    }

    if (tool.id !== 'html-to-pdf' && files.length < tool.minFiles) {
      setErrorMsg(`${tool.name} requires at least ${tool.minFiles} file(s).`);
      return;
    }

    if (tool.id === 'protect') {
      if (!options.password) {
        setErrorMsg('Please enter a password to protect your PDF.');
        return;
      }
      if (options.password !== options.confirmPassword) {
        setErrorMsg('Password confirmation does not match.');
        return;
      }
    }

    setIsProcessing(true);
    setUploadProgress(10);
    setProcessingStep('Preparing files...');

    const formData = new FormData();
    files.forEach((f) => {
      formData.append('files', f.file);
    });

    if (tool.id === 'html-to-pdf' && htmlUrl.trim()) {
      formData.append('url', htmlUrl.trim());
    }

    // Append options
    Object.entries(options).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        formData.append(k, String(v));
      }
    });

    try {
      setUploadProgress(35);
      setProcessingStep('Sending document to iLovePDF engine...');

      // Fake smooth progress simulation for UX
      const timer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 10 : prev));
      }, 500);

      const response = await fetch(`/api/process/${tool.id}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(timer);
      setUploadProgress(95);
      setProcessingStep('Generating output download...');

      if (!response.ok) {
        let errJson: any = null;
        try {
          errJson = await response.json();
        } catch {
          // ignore
        }

        if (errJson?.code === 'CREDENTIALS_MISSING' || response.status === 400 && errJson?.error?.includes('credentials')) {
          setIsMissingCredentials(true);
          setErrorMsg(
            errJson?.message ||
              'iLovePDF API credentials (ILOVEPDF_PUBLIC_KEY & ILOVEPDF_SECRET_KEY) are missing on the server. Please add them in your Render or .env environment settings.'
          );
        } else {
          setErrorMsg(errJson?.message || errJson?.error || `Server responded with error status ${response.status}`);
        }
        setIsProcessing(false);
        return;
      }

      // Successful response blob
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `PDFToolsPro_${tool.id}.${tool.outputExt}`;
      if (disposition && disposition.includes('filename=')) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const url = URL.createObjectURL(blob);
      setResultBlobUrl(url);
      setResultFileName(filename);
      setResultFileSize(blob.size);
      setUploadProgress(100);
      setIsProcessing(false);

      // Auto-trigger download once ready
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Process error:', err);
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Network error occurred while communicating with the PDF processing server.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb / Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-red-600 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All PDF Tools</span>
      </button>

      {/* Tool Header Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-xs border border-red-100">
              <ToolIcon name={tool.iconName} className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {tool.name}
                </h1>
                <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  {tool.outputExt.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-1 max-w-xl">
                {tool.tagline || tool.description}
              </p>
            </div>
          </div>

          <div className="text-xs text-zinc-500 flex sm:flex-col sm:items-end gap-2 sm:gap-1">
            <span className="font-semibold text-zinc-700">Accepted:</span>
            <span>{tool.acceptedExtensions.join(', ')}</span>
            <span className="text-zinc-400 text-[11px]">Max 50MB per file</span>
          </div>
        </div>

        {/* Missing Credentials Alert Banner */}
        {(!apiStatus?.configured || isMissingCredentials) && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">iLovePDF API Keys Notice:</span> Processing requires{' '}
                <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">ILOVEPDF_PUBLIC_KEY</code> and{' '}
                <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">ILOVEPDF_SECRET_KEY</code> in your
                server environment.
              </div>
            </div>
            <button
              onClick={onOpenApiModal}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors cursor-pointer"
            >
              How to configure keys
            </button>
          </div>
        )}

        {/* Main Work Area */}
        <div className="mt-8">
          {/* SUCCESS STATE */}
          {resultBlobUrl ? (
            <div className="py-12 px-6 text-center bg-zinc-50/70 rounded-3xl border border-zinc-200 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Task Completed Successfully!</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Your file is processed and ready for download.
              </p>

              <div className="my-6 p-4 bg-white rounded-2xl border border-zinc-200 inline-flex items-center gap-3 max-w-md text-left">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {resultFileName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatBytes(resultFileSize)} • {tool.outputExt.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleTriggerDownload}
                  className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-sm shadow-red-600/30 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Processed File</span>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Process Another</span>
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* PROCESSING STATE */
            <div className="py-16 px-6 text-center bg-zinc-50/50 rounded-3xl border border-zinc-200 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Processing Your Document</h3>
              <p className="text-sm text-zinc-500 mt-1">{processingStep}</p>

              {/* Progress Bar */}
              <div className="mt-6 w-full bg-zinc-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-zinc-400 mt-2">{uploadProgress}% complete</p>
            </div>
          ) : (
            /* UPLOAD & CONFIGURE STATE */
            <div>
              {/* HTML URL input if HTML to PDF */}
              {tool.id === 'html-to-pdf' && (
                <div className="mb-6 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                    Enter Webpage URL (or upload an HTML file below):
                  </label>
                  <div className="relative flex items-center">
                    <Globe className="absolute left-4 w-4 h-4 text-zinc-400" />
                    <input
                      type="url"
                      value={htmlUrl}
                      onChange={(e) => setHtmlUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-3xl transition-all cursor-pointer ${
                  isDragging
                    ? 'border-red-500 bg-red-50/60 scale-[0.99]'
                    : 'border-zinc-300 hover:border-red-400 bg-zinc-50/40 hover:bg-zinc-50/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={tool.maxFiles > 1}
                  accept={tool.acceptedMimeTypes || tool.acceptedExtensions.join(',')}
                  onChange={(e) => handleAddFiles(e.target.files)}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-red-100/80 text-red-600 flex items-center justify-center mb-4 shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-zinc-900 text-center">
                  Drag and drop {tool.name.toLowerCase()} files here
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 text-center">
                  or <span className="text-red-600 font-semibold underline underline-offset-2">browse your device</span>
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-zinc-400">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600">
                    Supports {tool.acceptedExtensions.join(', ')}
                  </span>
                  <span>•</span>
                  <span>Max file size: 50MB</span>
                  {tool.maxFiles > 1 && (
                    <>
                      <span>•</span>
                      <span>Up to {tool.maxFiles} files</span>
                    </>
                  )}
                </div>
              </div>

              {/* Uploaded Files List */}
              {files.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Uploaded Files ({files.length} / {tool.maxFiles})
                    </h4>
                    {files.length > 0 && (
                      <button
                        onClick={handleReset}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {files.map((fileItem, idx) => (
                      <div
                        key={fileItem.id}
                        className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 text-sm"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {tool.id === 'merge' && (
                            <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <File className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-semibold text-zinc-900 truncate text-xs sm:text-sm">
                              {fileItem.name}
                            </p>
                            <p className="text-[11px] text-zinc-500">{fileItem.formattedSize}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                          {tool.id === 'merge' && files.length > 1 && (
                            <div className="flex items-center gap-1 mr-2 text-xs">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveFile(idx, idx - 1)}
                                className="px-2 py-1 bg-white border border-zinc-200 rounded-md text-zinc-600 disabled:opacity-30 cursor-pointer"
                                title="Move up in merge sequence"
                              >
                                ↑
                              </button>
                              <button
                                disabled={idx === files.length - 1}
                                onClick={() => handleMoveFile(idx, idx + 1)}
                                className="px-2 py-1 bg-white border border-zinc-200 rounded-md text-zinc-600 disabled:opacity-30 cursor-pointer"
                                title="Move down in merge sequence"
                              >
                                ↓
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => handleRemoveFile(idx)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-zinc-200/60 rounded-lg transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOOL-SPECIFIC OPTIONS PANEL */}
              {(files.length > 0 || (tool.id === 'html-to-pdf' && htmlUrl.trim())) && (
                <div className="mt-8 p-6 bg-zinc-50 rounded-3xl border border-zinc-200">
                  <div className="flex items-center gap-2 mb-4 text-zinc-900 font-bold text-sm sm:text-base">
                    <Sliders className="w-4 h-4 text-red-600" />
                    <span>Configure {tool.name} Settings</span>
                  </div>

                  {/* Options: Compress */}
                  {tool.id === 'compress' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setOptions({ ...options, compression_level: 'recommended' })}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          options.compression_level === 'recommended'
                            ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-500/20'
                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <div className="font-bold text-sm">Recommended</div>
                        <div className="text-xs text-zinc-500 mt-1">
                          Good quality, good compression. Optimal for most uses.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOptions({ ...options, compression_level: 'extreme' })}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          options.compression_level === 'extreme'
                            ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-500/20'
                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <div className="font-bold text-sm">Extreme Compression</div>
                        <div className="text-xs text-zinc-500 mt-1">
                          Less quality, maximum file size reduction.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOptions({ ...options, compression_level: 'low' })}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          options.compression_level === 'low'
                            ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-500/20'
                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <div className="font-bold text-sm">Low Compression</div>
                        <div className="text-xs text-zinc-500 mt-1">
                          High quality, minimal compression applied.
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Options: Split */}
                  {tool.id === 'split' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setOptions({ ...options, split_mode: 'ranges' })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                            options.split_mode === 'ranges'
                              ? 'bg-red-600 text-white'
                              : 'bg-white border border-zinc-200 text-zinc-700'
                          }`}
                        >
                          Custom Ranges
                        </button>
                        <button
                          type="button"
                          onClick={() => setOptions({ ...options, split_mode: 'fixed_range' })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                            options.split_mode === 'fixed_range'
                              ? 'bg-red-600 text-white'
                              : 'bg-white border border-zinc-200 text-zinc-700'
                          }`}
                        >
                          Fixed Intervals
                        </button>
                        <button
                          type="button"
                          onClick={() => setOptions({ ...options, split_mode: 'remove_pages' })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                            options.split_mode === 'remove_pages'
                              ? 'bg-red-600 text-white'
                              : 'bg-white border border-zinc-200 text-zinc-700'
                          }`}
                        >
                          Remove Pages
                        </button>
                      </div>

                      {options.split_mode === 'ranges' && (
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Page ranges to extract (e.g. 1-3, 5, 8-10):
                          </label>
                          <input
                            type="text"
                            value={options.ranges || ''}
                            onChange={(e) => setOptions({ ...options, ranges: e.target.value })}
                            placeholder="1-2, 4"
                            className="w-full sm:w-80 px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                          />
                        </div>
                      )}

                      {options.split_mode === 'fixed_range' && (
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Split every N pages:
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={options.fixed_range || 1}
                            onChange={(e) => setOptions({ ...options, fixed_range: parseInt(e.target.value, 10) || 1 })}
                            className="w-32 px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                          />
                        </div>
                      )}

                      {options.split_mode === 'remove_pages' && (
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Pages to delete (e.g. 2, 4-6):
                          </label>
                          <input
                            type="text"
                            value={options.remove_pages || ''}
                            onChange={(e) => setOptions({ ...options, remove_pages: e.target.value })}
                            placeholder="2, 5"
                            className="w-full sm:w-80 px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Options: Rotate */}
                  {tool.id === 'rotate' && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-2">
                        Rotation Angle (Clockwise):
                      </label>
                      <div className="flex gap-3">
                        {[90, 180, 270].map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => setOptions({ ...options, rotate: deg as 90 | 180 | 270 })}
                            className={`px-5 py-3 rounded-2xl border text-sm font-bold cursor-pointer transition-all flex items-center gap-2 ${
                              options.rotate === deg
                                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>{deg}°</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Options: Watermark */}
                  {tool.id === 'watermark' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Watermark Text:
                        </label>
                        <input
                          type="text"
                          value={options.watermark_text || ''}
                          onChange={(e) => setOptions({ ...options, watermark_text: e.target.value })}
                          placeholder="e.g. CONFIDENTIAL, DRAFT, INTERNAL ONLY"
                          className="w-full sm:w-96 px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Vertical Position:
                          </label>
                          <select
                            value={options.vertical_position}
                            onChange={(e) => setOptions({ ...options, vertical_position: e.target.value as any })}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                          >
                            <option value="top">Top</option>
                            <option value="middle">Middle</option>
                            <option value="bottom">Bottom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Horizontal Position:
                          </label>
                          <select
                            value={options.horizontal_position}
                            onChange={(e) => setOptions({ ...options, horizontal_position: e.target.value as any })}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Stamp Rotation ({options.watermark_rotation}°):
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="15"
                            value={options.watermark_rotation || 45}
                            onChange={(e) => setOptions({ ...options, watermark_rotation: parseInt(e.target.value, 10) })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Opacity ({options.transparency}%):
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={options.transparency || 50}
                            onChange={(e) => setOptions({ ...options, transparency: parseInt(e.target.value, 10) })}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Options: Page Numbers */}
                  {tool.id === 'page-numbers' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Position on Page:
                        </label>
                        <select
                          value={options.page_position}
                          onChange={(e) => setOptions({ ...options, page_position: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        >
                          <option value="bottom-right">Bottom Right (Standard)</option>
                          <option value="bottom-center">Bottom Center</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="top-center">Top Center</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Starting Number:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={options.starting_number || 1}
                          onChange={(e) => setOptions({ ...options, starting_number: parseInt(e.target.value, 10) || 1 })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Options: Protect */}
                  {tool.id === 'protect' && (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Document Password:
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={options.password || ''}
                            onChange={(e) => setOptions({ ...options, password: e.target.value })}
                            placeholder="Enter secure password"
                            className="w-full px-3 py-2 pr-10 bg-white border border-zinc-300 rounded-xl text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Confirm Password:
                        </label>
                        <input
                          type="password"
                          value={options.confirmPassword || ''}
                          onChange={(e) => setOptions({ ...options, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Options: Unlock */}
                  {tool.id === 'unlock' && (
                    <div className="max-w-md">
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Current Document Password (if known):
                      </label>
                      <input
                        type="password"
                        value={options.filePassword || ''}
                        onChange={(e) => setOptions({ ...options, filePassword: e.target.value })}
                        placeholder="Leave blank to attempt automatic unlocking"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                      />
                    </div>
                  )}

                  {/* Options: OCR */}
                  {tool.id === 'pdf-ocr' && (
                    <div className="max-w-sm">
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Document Language for OCR:
                      </label>
                      <select
                        value={options.ocr_language}
                        onChange={(e) => setOptions({ ...options, ocr_language: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                      >
                        <option value="eng">English (eng)</option>
                        <option value="spa">Spanish (spa)</option>
                        <option value="fra">French (fra)</option>
                        <option value="deu">German (deu)</option>
                        <option value="ita">Italian (ita)</option>
                        <option value="por">Portuguese (por)</option>
                      </select>
                    </div>
                  )}

                  {/* Options: Image to PDF (JPG / PNG to PDF) */}
                  {(tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf') && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Orientation:
                        </label>
                        <select
                          value={options.orientation}
                          onChange={(e) => setOptions({ ...options, orientation: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Margins:
                        </label>
                        <select
                          value={options.margin}
                          onChange={(e) => setOptions({ ...options, margin: parseInt(e.target.value, 10) })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        >
                          <option value="0">No margin (fit image)</option>
                          <option value="10">Small margin</option>
                          <option value="20">Large margin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Page Size:
                        </label>
                        <select
                          value={options.pagesize}
                          onChange={(e) => setOptions({ ...options, pagesize: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        >
                          <option value="fit">Fit to Image</option>
                          <option value="A4">A4 Page</option>
                          <option value="letter">US Letter</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Options: PDF to JPG */}
                  {tool.id === 'pdf-to-jpg' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Conversion Mode:
                        </label>
                        <select
                          value={options.pdfjpg_mode}
                          onChange={(e) => setOptions({ ...options, pdfjpg_mode: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        >
                          <option value="pages">Convert Every Page to JPG</option>
                          <option value="extract">Extract Embedded Images Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Image Quality (DPI):
                        </label>
                        <select
                          value={options.dpi}
                          onChange={(e) => setOptions({ ...options, dpi: parseInt(e.target.value, 10) })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm"
                        >
                          <option value="150">Standard Quality (150 DPI)</option>
                          <option value="300">High Resolution (300 DPI)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message Display */}
              {errorMsg && (
                <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold">Execution Error</p>
                    <p className="mt-0.5 text-xs text-red-800 leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* ACTION EXECUTE BUTTON */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  id="process-tool-btn"
                  type="button"
                  disabled={
                    isProcessing ||
                    (tool.id !== 'html-to-pdf' && files.length < tool.minFiles) ||
                    (tool.id === 'html-to-pdf' && !files.length && !htmlUrl.trim())
                  }
                  onClick={handleProcess}
                  className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold rounded-2xl shadow-sm shadow-red-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
                >
                  <span>
                    {tool.id === 'merge'
                      ? `Merge ${files.length} PDFs`
                      : tool.id === 'compress'
                      ? 'Compress PDF Now'
                      : tool.id === 'split'
                      ? 'Split PDF Now'
                      : `Process ${tool.name}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Checklist Box */}
      <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
          About {tool.name} with iLovePDF Engine
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tool.features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-zinc-700">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
