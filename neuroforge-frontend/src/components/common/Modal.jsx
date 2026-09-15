import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  category,
  children,
  size = 'md',
  maxWidth,
}) => {
  const modalRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  const finalMaxWidth = maxWidth || sizeClasses[size] || 'max-w-xl';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] overflow-y-auto animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className={`w-full ${finalMaxWidth} rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-[#ECEAE5] flex items-start justify-between bg-[#FFFFFF]">
          <div className="space-y-1">
            {category && (
              <p className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F]">
                {category}
              </p>
            )}
            <h3 className="font-serif text-xl sm:text-2xl text-[#151515] font-normal tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#66635F] leading-relaxed font-sans font-light">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-[#99958F] hover:text-[#151515] hover:bg-[#F7F6F2] transition-colors -mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

