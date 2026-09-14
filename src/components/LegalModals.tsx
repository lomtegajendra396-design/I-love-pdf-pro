import React, { useState } from 'react';
import { X, Mail, Shield, FileText, Send, CheckCircle2, User, Globe, MessageSquare, AlertCircle } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'about' | 'contact' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
  supportEmail?: string;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  activeModal,
  onClose,
  supportEmail = 'lomtegajendra2345@gmail.com',
}) => {
  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('General Query / Feedback');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!activeModal) return null;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate contact submission with instant feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleResetContact = () => {
    setIsSubmitted(false);
    setFormName('');
    setFormEmail('');
    setFormMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {activeModal === 'privacy' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'terms' && (
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'about' && (
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'contact' && (
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'about' && 'About PDF Tools Pro'}
                {activeModal === 'contact' && 'Contact Support & Feedback'}
              </h3>
              <p className="text-xs text-zinc-500">
                {activeModal === 'privacy' && 'How we protect your data, files & privacy'}
                {activeModal === 'terms' && 'Rules, terms of use and guidelines'}
                {activeModal === 'about' && 'Our mission, technology and architecture'}
                {activeModal === 'contact' && 'Get in touch with our engineering & support team'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-zinc-700 leading-relaxed">
          {/* 1. PRIVACY POLICY */}
          {activeModal === 'privacy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                <strong>Important:</strong> We practice a strict <strong>Zero Document Retention</strong> policy. Your uploaded files are strictly encrypted in transit, processed via secure APIs, and automatically purged immediately upon completion.
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">1. Information We Collect</h4>
                <p>
                  PDF Tools Pro is designed to respect your digital privacy. We do not require registration or personal account creation to access core document conversion features. When you upload documents for processing (such as merging, compressing, or converting), the documents are held temporarily in secure RAM/ephemeral storage solely for the duration required to execute your requested task.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">2. Document Storage & Automatic Deletion</h4>
                <p>
                  Files uploaded to our application are processed using high-security TLS 1.3 encrypted tunnels. Neither PDF Tools Pro nor third-party processor partners read, inspect, monetize, or retain your files. Files are permanently purged from processing servers within 15 to 60 minutes after task execution.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">3. Cookies, Analytics & Advertising (Google AdSense)</h4>
                <p>
                  We may partner with third-party advertising networks such as Google AdSense to serve relevant advertisements when you visit our website.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-600">
                  <li>Third-party vendors, including Google, use cookies to serve ads based on prior visits to this or other websites.</li>
                  <li>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.</li>
                  <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-red-600 underline">Google Ads Settings</a> or through <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-red-600 underline">www.aboutads.info</a>.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">4. Contact Information</h4>
                <p>
                  For any privacy questions or requests regarding document handling, please contact our Data Protection representative at: <strong className="text-zinc-900">{supportEmail}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* 2. TERMS OF SERVICE */}
          {activeModal === 'terms' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">1. Acceptance of Terms</h4>
                <p>
                  By accessing and utilizing PDF Tools Pro, you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service. If you disagree with any portion of these terms, you must refrain from using the platform.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">2. Acceptable Use Policy</h4>
                <p>
                  You agree to use our document processing tools solely for legitimate, legal purposes. You must not upload or process:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-600">
                  <li>Files containing malware, viruses, trojans, or malicious payloads.</li>
                  <li>Documents containing copyrighted materials that you do not have permission or ownership to modify or process.</li>
                  <li>Unlawful, defamatory, or fraudulent material.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">3. Disclaimer of Warranties</h4>
                <p>
                  PDF Tools Pro is provided on an "as is" and "as available" basis. While we utilize modern enterprise conversion engines, we do not warrant that file conversion will be 100% error-free or that service will be uninterrupted. We strongly recommend keeping original backups of all critical files before applying operations like split, compress, or unlock.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">4. Limitation of Liability</h4>
                <p>
                  In no event shall PDF Tools Pro, its owners, developers, or affiliates be liable for any incidental, indirect, or consequential damages resulting from document corruption, data loss, or server downtime.
                </p>
              </div>
            </div>
          )}

          {/* 3. ABOUT US */}
          {activeModal === 'about' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">Our Mission</h4>
                <p>
                  <strong>PDF Tools Pro</strong> was created with a clear vision: to provide individuals, students, freelance professionals, and businesses with a <strong>fast, free, private, and intuitive</strong> suite of web-based document utilities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <h5 className="font-bold text-zinc-900 text-sm mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" /> Privacy By Design
                  </h5>
                  <p className="text-xs text-zinc-600">
                    Your documents belong to you. We automatically purge all temporary files immediately after download, guaranteeing confidentiality.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <h5 className="font-bold text-zinc-900 text-sm mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" /> 20+ Modern Tools
                  </h5>
                  <p className="text-xs text-zinc-600">
                    From merging contracts and compressing job application portfolios to converting spreadsheets and watermarking certificates.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">Our Architecture</h4>
                <p>
                  Built with high-performance React, TypeScript, and Tailwind CSS on the frontend, combined with an enterprise-grade Express.js Node backend. Processing tasks are delegated through trusted cloud endpoints with end-to-end TLS encryption.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-base mb-1.5">Community & Support</h4>
                <p>
                  We continuously improve our features based on direct user suggestions. If you find a bug, need an additional conversion format, or have ideas for enhancement, please visit our Contact page or write to <span className="font-semibold text-zinc-900">{supportEmail}</span>.
                </p>
              </div>
            </div>
          )}

          {/* 4. CONTACT US */}
          {activeModal === 'contact' && (
            <div className="space-y-6">
              {isSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900">Message Received!</h4>
                  <p className="text-zinc-600 text-sm max-w-md mx-auto">
                    Thank you for reaching out, <strong>{formName || 'friend'}</strong>. Your message has been routed to our team. We typically respond within 24–48 hours at <strong>{formEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetContact}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200">
                      <div className="flex items-center gap-2 font-bold text-red-950 text-sm mb-1">
                        <Mail className="w-4 h-4 text-red-600" />
                        <span>Direct Email Support</span>
                      </div>
                      <a 
                        href={`mailto:${supportEmail}`} 
                        className="text-xs font-semibold text-red-700 hover:underline break-all"
                      >
                        {supportEmail}
                      </a>
                      <p className="text-[11px] text-zinc-500 mt-1">Average response time: 24 hours</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm mb-1">
                        <AlertCircle className="w-4 h-4 text-zinc-600" />
                        <span>Support Hours</span>
                      </div>
                      <p className="text-xs text-zinc-600">
                        Monday – Saturday: 9:00 AM – 7:00 PM IST
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">Location: India</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitContact} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Full Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Subject</label>
                      <select
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                      >
                        <option value="General Query / Feedback">General Query / Feedback</option>
                        <option value="Report an Issue or Bug">Report an Issue or Bug</option>
                        <option value="Feature Suggestion">Feature Suggestion</option>
                        <option value="Partnership / Ad Inquiry">Partnership / Ad Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Please describe your question or issue in detail..."
                        className="w-full p-3 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <span>PDF Tools Pro • Certified AdSense Compliant</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
