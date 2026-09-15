import React from 'react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText,
  confirmLabel,
  confirmVariant = 'danger',
  variant,
  loading = false,
}) => {
  const handleCancel = onCancel || onClose;
  const label = confirmLabel || confirmText || 'Delete';
  const finalVariant = variant || confirmVariant;

  const variantStyles = {
    danger: 'bg-[#A61C1C] hover:bg-[#8B1414] text-[#FFFFFF]',
    warning: 'bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF]',
    primary: 'bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF]',
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title} maxWidth="max-w-md">
      <div className="space-y-6">
        <p className="text-sm text-[#66635F] leading-relaxed font-sans font-light">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECEAE5]">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 rounded-[3px] text-xs font-medium tracking-wide uppercase transition-all ${
              variantStyles[finalVariant] || variantStyles.danger
            } disabled:opacity-50`}
          >
            {loading ? 'Processing...' : label}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

