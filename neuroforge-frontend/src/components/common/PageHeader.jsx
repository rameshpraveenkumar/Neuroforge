import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  description,
  category,
  badge,
  badgeColor,
  icon: Icon,
  action,
  actions,
}) => {
  const descText = subtitle || description;
  const actionContent = action || actions;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 border-b border-[#ECEAE5]">
      <div className="space-y-2">
        {category && (
          <p className="text-[10px] tracking-[0.16em] uppercase font-medium text-[#99958F]">
            {category}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#151515] font-normal tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-0.5 rounded-[2px] bg-[#F7F6F2] text-[#66635F] border border-[#DEDCD6]">
              {badge}
            </span>
          )}
        </div>
        {descText && (
          <p className="text-sm text-[#66635F] max-w-2xl leading-relaxed font-sans font-light">
            {descText}
          </p>
        )}
      </div>

      {actionContent && (
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          {actionContent}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

