import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon: Icon }) => {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#101a34] shadow-lg transition-all hover:border-white/30 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4">
          {Icon && (
            <Icon className="h-5 w-5 text-indigo-300" />
          )}
          <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
