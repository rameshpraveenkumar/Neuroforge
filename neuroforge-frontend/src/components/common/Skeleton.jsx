import React from 'react';

export const Skeleton = ({ className = '', rows = 1 }) => {
  if (rows > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded-md bg-[#EAEAEA] animate-pulse ${className}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`rounded-md bg-[#EAEAEA] animate-pulse ${className || 'h-4 w-full'}`}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E6E6E3] animate-pulse space-y-4">
      <div className="h-6 bg-[#EAEAEA] rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="grid gap-4 py-2 border-b border-[#EEEEEB]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="h-4 bg-[#EAEAEA] rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E6E6E3] animate-pulse space-y-3">
          <div className="h-4 bg-[#EAEAEA] rounded w-1/2"></div>
          <div className="h-7 bg-[#EAEAEA] rounded w-1/3"></div>
          <div className="h-3 bg-[#EAEAEA] rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
