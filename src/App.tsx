import React, { useState } from 'react';
import { Header } from './components/Header';
import { VideoTitleSection } from './components/VideoTitleSection';
import { BioGeneratorSection } from './components/BioGeneratorSection';
import { HashtagGeneratorSection } from './components/HashtagGeneratorSection';
import { Footer } from './components/Footer';
import { LegalModal, ModalType } from './components/LegalModal';
import { Toast } from './components/Toast';
import { Sparkles, Video, User, Hash } from 'lucide-react';

export default function App() {
  // Accordion state: only one section open at a time ('title' | 'bio' | 'hashtag' | null)
  const [activeSection, setActiveSection] = useState<'title' | 'bio' | 'hashtag' | null>('title');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  const handleToggleSection = (section: 'title' | 'bio' | 'hashtag') => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="min-h-screen bg-white text-black font-roboto flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col items-center">
        {/* Subtle Intro SEO Heading */}
        <section className="w-full text-center mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-black/20 text-xs font-semibold text-black bg-white mb-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI Micro-Tool for Content Creators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black font-roboto">
            Create Viral Titles, Bios & Tags
          </h1>
          <p className="text-base sm:text-lg font-normal text-black/70 max-w-2xl mx-auto font-roboto">
            Click any micro-tool below to expand its dedicated AI studio. Engineered for YouTube, Instagram, TikTok & Shorts algorithms.
          </p>
        </section>

        {/* 3 Main Buttons Stack with generous half-length distance spacing */}
        <div className="w-full flex flex-col items-center space-y-12 sm:space-y-16">
          {/* 1st Button & Section: Video Title Generator */}
          <div className="w-full flex justify-center">
            <VideoTitleSection
              isOpen={activeSection === 'title'}
              onToggle={() => handleToggleSection('title')}
              onShowToast={showToast}
            />
          </div>

          {/* 2nd Button & Section: Bio Generator */}
          <div className="w-full flex justify-center">
            <BioGeneratorSection
              isOpen={activeSection === 'bio'}
              onToggle={() => handleToggleSection('bio')}
              onShowToast={showToast}
            />
          </div>

          {/* 3rd Button & Section: Hashtag Generator */}
          <div className="w-full flex justify-center">
            <HashtagGeneratorSection
              isOpen={activeSection === 'hashtag'}
              onToggle={() => handleToggleSection('hashtag')}
              onShowToast={showToast}
            />
          </div>
        </div>

        {/* Feature quick highlight chips */}
        <section className="w-full max-w-2xl mt-20 pt-8 border-t border-black/10 flex flex-wrap items-center justify-around gap-4 text-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-black/80 font-roboto">
            <div className="w-6 h-6 rounded-full border border-black/30 flex items-center justify-center">
              <Video className="w-3 h-3 text-black" />
            </div>
            <span>High-CTR Titles</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-black/80 font-roboto">
            <div className="w-6 h-6 rounded-full border border-black/30 flex items-center justify-center">
              <User className="w-3 h-3 text-black" />
            </div>
            <span>Converting Bios</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-black/80 font-roboto">
            <div className="w-6 h-6 rounded-full border border-black/30 flex items-center justify-center">
              <Hash className="w-3 h-3 text-black" />
            </div>
            <span>30-Tag Strategy</span>
          </div>
        </section>
      </main>

      {/* Footer with 4 links */}
      <Footer onOpenModal={(type) => setActiveModal(type)} />

      {/* Pop-up Modals for About, Contact, Privacy, Terms */}
      <LegalModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
