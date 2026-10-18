import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-outline/30 text-xs sm:text-sm font-medium max-w-md">
        <span className="material-symbols-outlined text-emerald-400 text-[20px]">
          check_circle
        </span>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-inverse-on-surface/70 hover:text-inverse-on-surface p-1"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
