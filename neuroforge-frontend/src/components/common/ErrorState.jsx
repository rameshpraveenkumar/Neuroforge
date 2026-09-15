import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorState = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
}) => {
  return (
    <div className="p-8 md:p-10 rounded-[3px] bg-[#FCF2F2] border border-[#F4D2D2] text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 space-y-3">
      <div className="w-9 h-9 rounded-[2px] bg-[#F9E2E2] text-[#A61C1C] flex items-center justify-center border border-[#F4D2D2]">
        <AlertCircle className="w-4 h-4" />
      </div>
      <h3 className="font-serif text-lg font-normal text-[#A61C1C] tracking-tight">{title}</h3>
      <p className="text-xs text-[#7A1E1E] max-w-xs leading-relaxed font-sans font-light">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-[#A61C1C] hover:bg-[#8B1414] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;

