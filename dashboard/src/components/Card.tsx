import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon: Icon }) => {
  return (
    <div className={`bg-[#1e293b] rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-xl shadow-black/30 card-hover ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-indigo-400" />
              </div>
            )}
            <h3 className="text-[#f8fafc] text-lg font-semibold tracking-tight">{title}</h3>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
