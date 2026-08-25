import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-black rounded-2xl shadow-2xl text-black font-roboto"
        >
          {type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-black flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-black/50 hover:text-black font-bold text-base focus:outline-hidden"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
