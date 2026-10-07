import { format, parseISO, isValid } from 'date-fns';

export const formatCurrency = (amount, currency = 'USD') => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return 'N/A';
    return format(date, formatStr);
  } catch (error) {
    return 'N/A';
  }
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Completed':
    case 'Paid':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Partially Paid':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'High':
    case 'Urgent':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
