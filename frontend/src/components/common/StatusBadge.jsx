import React from 'react';
import { getStatusBadgeStyle } from '../../utils/formatters';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const style = getStatusBadgeStyle(status);

  // Status indicator dot color
  let dotColor = 'bg-slate-400';
  if (status === 'Completed' || status === 'Paid') dotColor = 'bg-emerald-500';
  if (status === 'In Progress') dotColor = 'bg-blue-500';
  if (status === 'Pending') dotColor = 'bg-amber-500';
  if (status === 'Partially Paid') dotColor = 'bg-purple-500';
  if (status === 'Cancelled' || status === 'High' || status === 'Urgent') dotColor = 'bg-rose-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
