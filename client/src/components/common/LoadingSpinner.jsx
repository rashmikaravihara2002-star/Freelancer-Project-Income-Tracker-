import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] w-full gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {message && <p className="text-xs font-medium text-slate-500 animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
