import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import { DollarSign, Calendar, CreditCard, Hash, FileText, User } from 'lucide-react';
import { format } from 'date-fns';

const IncomeModal = ({
  isOpen,
  onClose,
  onSave,
  income = null,
  projects = [],
  clients = [],
  preselectedProject = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    projectId: '',
    clientId: '',
    amount: '',
    paymentDate: format(new Date(), 'yyyy-MM-dd'),
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (income) {
      setFormData({
        projectId: income.projectId?._id || income.projectId || '',
        clientId: income.clientId?._id || income.clientId || '',
        amount: income.amount !== undefined ? income.amount : '',
        paymentDate: income.paymentDate
          ? format(new Date(income.paymentDate), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        paymentStatus: income.paymentStatus || 'Paid',
        paymentMethod: income.paymentMethod || 'Bank Transfer',
        invoiceNumber: income.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
        notes: income.notes || '',
      });
    } else if (preselectedProject) {
      setFormData({
        projectId: preselectedProject._id,
        clientId: preselectedProject.clientId?._id || preselectedProject.clientId || '',
        amount: preselectedProject.remainingBalance > 0 ? preselectedProject.remainingBalance : '',
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        notes: `Payment for ${preselectedProject.projectName}`,
      });
    } else {
      const defaultProj = projects.length > 0 ? projects[0] : null;
      setFormData({
        projectId: defaultProj ? defaultProj._id : '',
        clientId: defaultProj?.clientId?._id || defaultProj?.clientId || (clients.length > 0 ? clients[0]._id : ''),
        amount: '',
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        notes: '',
      });
    }
    setErrors({});
  }, [income, preselectedProject, projects, clients, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto update client if project selection changes
    if (name === 'projectId') {
      const selectedProj = projects.find((p) => p._id === value);
      const clientId = selectedProj?.clientId?._id || selectedProj?.clientId || formData.clientId;
      setFormData((prev) => ({ ...prev, projectId: value, clientId }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.projectId) errs.projectId = 'Please select a project';
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.paymentDate) errs.paymentDate = 'Payment date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData, income?._id);
  };

  const projectOptions = [
    { value: '', label: '-- Select a Project --' },
    ...projects.map((p) => ({
      value: p._id,
      label: `${p.projectName} (${p.clientId?.name || 'Client'})`,
    })),
  ];

  const paymentStatusOptions = [
    { value: 'Paid', label: 'Paid / Received' },
    { value: 'Pending', label: 'Pending / Invoice Sent' },
  ];

  const paymentMethodOptions = [
    { value: 'Bank Transfer', label: 'Bank Transfer / Wire' },
    { value: 'Stripe', label: 'Stripe' },
    { value: 'PayPal', label: 'PayPal' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Crypto', label: 'Cryptocurrency' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={income ? 'Edit Income Transaction' : 'Record Income / Payment'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Associated Project"
            name="projectId"
            type="select"
            value={formData.projectId}
            onChange={handleChange}
            options={projectOptions}
            required
            error={errors.projectId}
          />

          <FormInput
            label="Amount ($)"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            icon={DollarSign}
            required
            error={errors.amount}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Payment Date"
            name="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            icon={Calendar}
            required
            error={errors.paymentDate}
          />

          <FormInput
            label="Payment Status"
            name="paymentStatus"
            type="select"
            value={formData.paymentStatus}
            onChange={handleChange}
            options={paymentStatusOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Payment Method"
            name="paymentMethod"
            type="select"
            value={formData.paymentMethod}
            onChange={handleChange}
            options={paymentMethodOptions}
            icon={CreditCard}
          />

          <FormInput
            label="Invoice / Ref Number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="e.g. INV-2026-001"
            icon={Hash}
          />
        </div>

        <FormInput
          label="Notes / Scope Description"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g. Milestone 1 upfront deposit, sprint 3 delivery..."
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-200 transition-all disabled:opacity-50"
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {income ? 'Update Payment' : 'Save Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IncomeModal;
