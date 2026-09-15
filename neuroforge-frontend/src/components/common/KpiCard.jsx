import React from 'react';

export const KpiCard = ({
  title,
  value,
  subtext,
  change,
  icon: Icon,
  badge,
}) => {
  const metaText = change || subtext;

  return (
    <div className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] hover:border-[#DEDCD6] transition-colors flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#99958F]">
          {title}
        </span>
        {badge && (
          <span className="text-[9px] font-medium tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-[2px] bg-[#F7F6F2] text-[#66635F] border border-[#ECEAE5]">
            {badge}
          </span>
        )}
      </div>

      <div className="my-3">
        <p className="font-serif text-3xl sm:text-4xl text-[#151515] font-normal tracking-tight">
          {value ?? '--'}
        </p>
      </div>

      {metaText && (
        <p className="text-xs text-[#66635F] font-sans font-light truncate">
          {metaText}
        </p>
      )}
    </div>
  );
};

export default KpiCard;

