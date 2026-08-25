import React from 'react';
import { ModalType } from './LegalModal';

interface FooterProps {
  onOpenModal: (type: ModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 mt-16 border-t border-black/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Copyright & branding */}
        <div className="text-xs sm:text-sm font-roboto font-normal text-black/60">
          © {new Date().getFullYear()} <span className="font-bold text-black">AI Micro-Tool</span>. High-CTR SEO utility for creators.
        </div>

        {/* 4 Footer Links in a clean row */}
        <nav aria-label="Legal and About Links" className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <button
            type="button"
            onClick={() => onOpenModal('about')}
            className="font-roboto font-normal text-sm sm:text-base text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-hidden hover:underline underline-offset-4"
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('contact')}
            className="font-roboto font-normal text-sm sm:text-base text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-hidden hover:underline underline-offset-4"
          >
            Contact Us
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('privacy')}
            className="font-roboto font-normal text-sm sm:text-base text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-hidden hover:underline underline-offset-4"
          >
            Privacy Policy
          </button>

          <button
            type="button"
            onClick={() => onOpenModal('terms')}
            className="font-roboto font-normal text-sm sm:text-base text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-hidden hover:underline underline-offset-4"
          >
            Terms & Conditions
          </button>
        </nav>
      </div>
    </footer>
  );
};
