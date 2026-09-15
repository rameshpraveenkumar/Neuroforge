import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria or currently available in the system.',
  actionLabel,
  actionText,
  onAction,
}) => {
  const btnLabel = actionLabel || actionText;

  return (
    <div className="p-10 md:p-14 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 space-y-4">
      <div className="w-10 h-10 rounded-[2px] bg-[#F7F6F2] text-[#99958F] flex items-center justify-center border border-[#ECEAE5]">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-serif text-xl text-[#151515] font-normal tracking-tight">{title}</h3>
      <p className="text-xs text-[#66635F] max-w-xs leading-relaxed font-sans font-light">
        {description}
      </p>
      {btnLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{btnLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;

