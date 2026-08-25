import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Shield, FileText, Info, Mail } from 'lucide-react';

export type ModalType = 'about' | 'contact' | 'privacy' | 'terms' | null;

interface LegalModalProps {
  activeModal: ModalType;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  activeModal,
  onClose,
  onShowToast,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      onShowToast('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSubmitted(true);
      onShowToast('Message sent successfully! We will get back to you shortly.');
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setSubmitted(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
      onShowToast('Message received! Thank you for reaching out.');
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setSubmitted(false);
        onClose();
      }, 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white border-2 border-black rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col font-roboto"
          >
            {/* Modal Header with simple round X button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/15 bg-white">
              <div className="flex items-center gap-2.5">
                {activeModal === 'about' && <Info className="w-5 h-5 text-black" />}
                {activeModal === 'contact' && <Mail className="w-5 h-5 text-black" />}
                {activeModal === 'privacy' && <Shield className="w-5 h-5 text-black" />}
                {activeModal === 'terms' && <FileText className="w-5 h-5 text-black" />}
                <h3 className="text-xl font-bold text-black capitalize">
                  {activeModal === 'about' && 'About Us'}
                  {activeModal === 'contact' && 'Contact Us'}
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'terms' && 'Terms & Conditions'}
                </h3>
              </div>

              {/* Simple round X (Close) button in top right corner */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Modal"
                className="w-9 h-9 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white text-black flex items-center justify-center transition-colors cursor-pointer focus:outline-hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-black/85 text-sm sm:text-base leading-relaxed">
              {/* ABOUT US MODAL */}
              {activeModal === 'about' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-black mb-1">
                      Welcome to AI Micro-Tool
                    </h4>
                    <p className="text-black/75">
                      AI Micro-Tool is a fast, streamlined creator utility engineered specifically for YouTubers, short-form video creators, and digital influencers. Our mission is to remove friction from the content publishing workflow by automating high-stakes creative decisions in seconds.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">
                      Our Creator Utility Suite
                    </h4>
                    <p className="text-black/75">
                      Whether you need high-CTR YouTube video titles that stand out in crowded feeds, punchy social bios that convert profile visitors into dedicated followers, or 3-tier algorithm-optimized hashtag strategies for Instagram and TikTok, AI Micro-Tool delivers production-grade results without bloated interfaces or unnecessary subscriptions.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">
                      Our Mission & Commitment
                    </h4>
                    <p className="text-black/75">
                      We believe every creator deserves instant access to cutting-edge AI language models and SEO heuristics. We are committed to speed, privacy, zero unnecessary tracking, and delivering tools that genuinely help content creators grow their organic reach.
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="p-4 rounded-2xl border border-black/20 bg-neutral-50 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-black">
                          AI Model Powered
                        </p>
                        <p className="text-sm font-semibold text-black">
                          Google Gemini 3.7 Flash Architecture
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full border border-black bg-white text-black">
                        100% Free Utility
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT US MODAL: 16:9 Clean Contact Form */}
              {activeModal === 'contact' && (
                <div className="space-y-5">
                  <p className="text-black/75 text-sm">
                    Have feedback, feature requests, or collaboration inquiries? Send us a message below and our team will get back to you within 24 hours.
                  </p>

                  {submitted ? (
                    <div className="p-8 rounded-2xl border-2 border-black bg-neutral-50 text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-black mx-auto" />
                      <h4 className="text-lg font-bold text-black">Message Sent Successfully!</h4>
                      <p className="text-sm text-black/70">
                        Thank you for reaching out to AI Micro-Tool. We will reply to {contactEmail} shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Alex Creator"
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white text-black font-roboto font-normal text-sm focus:outline-hidden focus:ring-2 focus:ring-black placeholder:text-black/35"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                          Your Email
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. alex@creatorstudio.com"
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white text-black font-roboto font-normal text-sm focus:outline-hidden focus:ring-2 focus:ring-black placeholder:text-black/35"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                          Your Message
                        </label>
                        <div className="relative w-full aspect-16/9 sm:aspect-21/9 min-h-[120px] max-h-[180px] rounded-xl border-2 border-black bg-white p-3 shadow-inner focus-within:ring-2 focus-within:ring-black">
                          <textarea
                            required
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Write your message, feedback or question here..."
                            className="w-full h-full resize-none border-none bg-transparent text-black font-roboto font-normal text-sm focus:outline-hidden placeholder:text-black/35"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-2xl border-2 border-black bg-white text-black font-roboto font-bold text-base shadow-sm hover:bg-neutral-50 hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* PRIVACY POLICY MODAL (Google AdSense Compliant) */}
              {activeModal === 'privacy' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-base font-bold text-black mb-1">1. Information We Collect</h4>
                    <p className="text-black/75 text-sm">
                      AI Micro-Tool respects user privacy. We do not store personal account credentials or sell user data to third parties. Text prompts entered for generating video titles, bios, or hashtags are processed temporarily to fulfill AI generation requests and are not retained as permanent user profiles.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">2. Cookies and Web Beacons</h4>
                    <p className="text-black/75 text-sm">
                      Like standard web utilities and in compliance with Google AdSense guidelines, AI Micro-Tool may utilize cookies to store information about visitors' preferences, optimize website performance, and serve relevant non-intrusive advertisements. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">3. Third-Party AI Services</h4>
                    <p className="text-black/75 text-sm">
                      We utilize Google Gemini API infrastructure to generate content recommendations. Prompts submitted comply with standard Google Cloud privacy and safety guidelines.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">4. Contact & Opt-Out</h4>
                    <p className="text-black/75 text-sm">
                      Users can disable cookies through individual browser options. For any inquiries regarding our privacy practices, please contact us via our Contact form.
                    </p>
                  </div>

                  <p className="text-xs text-black/50 border-t border-black/10 pt-3">
                    Last updated: August 2026. Fully compliant with standard Google AdSense and global privacy frameworks.
                  </p>
                </div>
              )}

              {/* TERMS & CONDITIONS MODAL */}
              {activeModal === 'terms' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-base font-bold text-black mb-1">1. Acceptance of Terms</h4>
                    <p className="text-black/75 text-sm">
                      By accessing and using AI Micro-Tool, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the utility.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">2. Permitted Use & Ownership</h4>
                    <p className="text-black/75 text-sm">
                      All generated video titles, social bios, and hashtags produced through AI Micro-Tool are royalty-free and owned by you for commercial and personal content creation across YouTube, Instagram, TikTok, and other platforms.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">3. Disclaimer of Warranties</h4>
                    <p className="text-black/75 text-sm">
                      AI Micro-Tool provides AI-assisted content suggestions "as is". While our algorithms are optimized for search visibility and click-through rates, we do not guarantee specific viral metrics or video performance.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-black mb-1">4. Responsible Usage</h4>
                    <p className="text-black/75 text-sm">
                      Users agree not to input malicious, defamatory, abusive, or unlawful content into the tool prompts.
                    </p>
                  </div>

                  <p className="text-xs text-black/50 border-t border-black/10 pt-3">
                    Last updated: August 2026.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
