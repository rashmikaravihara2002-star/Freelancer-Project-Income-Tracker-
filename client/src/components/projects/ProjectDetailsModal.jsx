import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Briefcase, Calendar, DollarSign, User, FileText, CheckCircle2, Clock, Plus } from 'lucide-react';

const ProjectDetailsModal = ({ isOpen, onClose, project, onAddPayment }) => {
  if (!project) return null;

  const fee = project.fee || 0;
  const paid = project.paidAmount || 0;
  const balance = project.remainingBalance !== undefined ? project.remainingBalance : Math.max(0, fee - paid);
  const progressPercent = fee > 0 ? Math.min(100, Math.round((paid / fee) * 100)) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Overview" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
              {project.category || 'Web Development'}
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={project.status} />
              <StatusBadge status={project.priority} />
            </div>
          </div>
          <h4 className="text-lg font-bold text-slate-900">{project.projectName}</h4>
          {project.description && (
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">{project.description}</p>
          )}
        </div>

        {/* Client & Timeline Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center gap-3">
            <User className="w-4 h-4 text-brand-500" />
            <div>
              <p className="text-slate-400 font-medium">Client</p>
              <p className="text-slate-800 font-bold">{project.clientId?.name || 'Unknown Client'}</p>
              {project.clientId?.company && (
                <p className="text-[11px] text-slate-500">{project.clientId.company}</p>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center gap-3">
            <Calendar className="w-4 h-4 text-brand-500" />
            <div>
              <p className="text-slate-400 font-medium">Timeline & Deadline</p>
              <p className="text-slate-800 font-bold">
                Due: {formatDate(project.deadline)}
              </p>
              <p className="text-[11px] text-slate-500">Started: {formatDate(project.startDate)}</p>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-brand-400" />
              Financial & Payment Summary
            </h5>
            <StatusBadge status={project.paymentStatus || project.calculatedPaymentStatus} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pb-4 border-b border-slate-700/60">
            <div>
              <p className="text-[11px] text-slate-400">Total Contract</p>
              <p className="text-base font-bold text-white mt-0.5">{formatCurrency(fee)}</p>
            </div>
            <div>
              <p className="text-[11px] text-emerald-400 font-medium">Paid Received</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">{formatCurrency(paid)}</p>
            </div>
            <div>
              <p className="text-[11px] text-amber-400 font-medium">Remaining Balance</p>
              <p className="text-base font-bold text-amber-400 mt-0.5">{formatCurrency(balance)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-300 mb-1.5 font-medium">
              <span>Payment Progress</span>
              <span>{progressPercent}% Funded</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Payment History List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Payments & Invoices ({project.payments?.length || 0})
            </h5>
            {onAddPayment && (
              <button
                onClick={() => {
                  onClose();
                  onAddPayment(project);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <Plus className="w-3.5 h-3.5" />
                Record Payment
              </button>
            )}
          </div>

          {project.payments && project.payments.length > 0 ? (
            <div className="space-y-2">
              {project.payments.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{p.invoiceNumber}</span>
                      <span className="text-[10px] text-slate-400">• {p.paymentMethod}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(p.paymentDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={p.paymentStatus} />
                    <span className="font-bold text-slate-900">{formatCurrency(p.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No payments recorded yet for this project.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetailsModal;
