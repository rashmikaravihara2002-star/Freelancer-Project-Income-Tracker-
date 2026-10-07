import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generateInvoicePDF } from '../../utils/exportPdf';
import { Download, Printer, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const InvoicePreviewModal = ({ isOpen, onClose, income }) => {
  const { user } = useAuth();
  if (!income) return null;

  const handleDownloadPDF = () => {
    generateInvoicePDF(income, user);
  };

  const handlePrint = () => {
    window.print();
  };

  const client = income.clientId || {};
  const project = income.projectId || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice & Payment Receipt" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Actions Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Invoice:</span>
            <span className="text-sm font-bold text-slate-900">{income.invoiceNumber}</span>
            <StatusBadge status={income.paymentStatus} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-slate-800" id="printable-invoice">
          {/* Top Banner */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-xl font-black text-brand-600 tracking-tight">INVOICE</h2>
              <p className="text-xs text-slate-400 mt-1">Ref: {income.invoiceNumber}</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-700">Date Issued:</p>
              <p className="text-slate-500">{formatDate(income.paymentDate)}</p>
              <p className="font-bold text-slate-700 mt-2">Payment Method:</p>
              <p className="text-slate-500">{income.paymentMethod}</p>
            </div>
          </div>

          {/* Two Columns: From & To */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-100 text-xs">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider mb-1.5">From (Freelancer)</p>
              <p className="font-bold text-slate-900 text-sm">{user?.name || 'Freelance Professional'}</p>
              <p className="text-slate-600">{user?.title || 'Software Engineer'}</p>
              <p className="text-slate-600">{user?.email}</p>
              {user?.phone && <p className="text-slate-600">{user.phone}</p>}
              {user?.company && <p className="text-slate-600">{user.company}</p>}
            </div>

            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider mb-1.5">Billed To (Client)</p>
              <p className="font-bold text-slate-900 text-sm">{client.name || 'Valued Client'}</p>
              {client.company && <p className="text-slate-600">{client.company}</p>}
              <p className="text-slate-600">{client.email}</p>
              {client.phone && <p className="text-slate-600">{client.phone}</p>}
              {client.address && <p className="text-slate-600">{client.address}</p>}
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="py-6 border-b border-slate-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Project & Description</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5">
                    <p className="font-bold text-slate-800">{project.projectName || 'General Services'}</p>
                    <p className="text-slate-500 mt-0.5">{income.notes || 'Project deliverables milestone'}</p>
                  </td>
                  <td className="py-3.5 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(income.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(income.amount)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Tax (0%):</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-brand-600 text-base">{formatCurrency(income.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
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

export default InvoicePreviewModal;
