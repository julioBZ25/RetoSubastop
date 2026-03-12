'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from './button';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-lg rounded-xl border border-dashsuba-border bg-white shadow-lg animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-dashsuba-border p-4">
          <h2 className="text-xl font-semibold text-dashsuba-primary">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-dashsuba-secondary">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal };
