import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'Get started by creating a new entry.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 my-4">
      <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 shadow-sm shadow-brand-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
