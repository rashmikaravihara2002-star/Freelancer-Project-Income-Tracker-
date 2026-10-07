import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import IncomeModal from '../components/income/IncomeModal';
import InvoicePreviewModal from '../components/income/InvoicePreviewModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import StatCard from '../components/common/StatCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCsv';
import { generateIncomeReportPDF } from '../utils/exportPdf';
import {
  DollarSign,
  Search,
  Plus,
  Filter,
  Download,
  FileText,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  Building,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Income = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [incomes, setIncomes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    pendingIncome: 0,
    thisMonthIncome: 0,
    totalEntries: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [previewingInvoice, setPreviewingInvoice] = useState(null);
  const [deletingIncome, setDeletingIncome] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchDropdownData = async () => {
    try {
      const [projRes, clientRes] = await Promise.all([
        api.get('/projects'),
        api.get('/clients'),
      ]);
      if (projRes.data.success) setProjects(projRes.data.data);
      if (clientRes.data.success) setClients(clientRes.data.data);
    } catch (error) {
      console.error('Failed to load dropdown items:', error);
    }
  };

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (projectFilter !== 'All') queryParams.append('projectId', projectFilter);
      if (paymentStatusFilter !== 'All') queryParams.append('paymentStatus', paymentStatusFilter);
      if (paymentMethodFilter !== 'All') queryParams.append('paymentMethod', paymentMethodFilter);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const res = await api.get(`/income?${queryParams.toString()}`);
      if (res.data.success) {
        setIncomes(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (error) {
      toast.error('Failed to load income transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIncomes();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, projectFilter, paymentStatusFilter, paymentMethodFilter, startDate, endDate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      setIsIncomeModalOpen(true);
    }
  }, [location.search]);

  const handleSaveIncome = async (formData, id) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const res = await api.put(`/income/${id}`, formData);
        if (res.data.success) {
          toast.success('Income transaction updated');
          fetchIncomes();
          setIsIncomeModalOpen(false);
          setEditingIncome(null);
        }
      } else {
        const res = await api.post('/income', formData);
        if (res.data.success) {
          toast.success('Income transaction recorded');
          fetchIncomes();
          setIsIncomeModalOpen(false);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save income record';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIncome = async () => {
    if (!deletingIncome) return;
    try {
      setIsSubmitting(true);
      const res = await api.delete(`/income/${deletingIncome._id}`);
      if (res.data.success) {
        toast.success('Income record deleted');
        fetchIncomes();
        setDeletingIncome(null);
      }
    } catch (error) {
      toast.error('Failed to delete income record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const exportData = incomes.map((inc) => ({
      InvoiceNumber: inc.invoiceNumber || '',
      Date: formatDate(inc.paymentDate, 'yyyy-MM-dd'),
      Project: inc.projectId?.projectName || '',
      Client: inc.clientId?.name || '',
      Company: inc.clientId?.company || '',
      Amount: inc.amount,
      Status: inc.paymentStatus,
      Method: inc.paymentMethod,
      Notes: inc.notes || '',
    }));
    exportToCSV(exportData, `freelancer_income_${formatDate(new Date(), 'yyyyMMdd')}.csv`);
  };

  const handleExportPDFReport = () => {
    generateIncomeReportPDF(incomes, summary, user);
  };

  // Pagination calculation
  const totalPages = Math.ceil(incomes.length / itemsPerPage);
  const paginatedIncomes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return incomes.slice(start, start + itemsPerPage);
  }, [incomes, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Income & Financials</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track received payments, pending invoices, cash flow, and export reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDFReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            <span>PDF Report</span>
          </button>
          <button
            onClick={() => {
              setEditingIncome(null);
              setIsIncomeModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 shadow-sm shadow-brand-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Income</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Paid Income"
          value={formatCurrency(summary.totalIncome)}
          subtitle="Lifetime received earnings"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Receivables"
          value={formatCurrency(summary.pendingIncome)}
          subtitle="Unpaid issued invoices"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="This Month's Income"
          value={formatCurrency(summary.thisMonthIncome)}
          subtitle="Current calendar month total"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by invoice #, project, client, notes..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={projectFilter}
              onChange={(e) => {
                setProjectFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="All">All Payment Methods</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Stripe">Stripe</option>
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Crypto">Crypto</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Date Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date Range:
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-brand-600 font-semibold hover:underline"
            >
              Clear dates
            </button>
          )}
        </div>
      </div>

      {/* Income Table */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading financial transactions..." />
      ) : paginatedIncomes.length > 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedIncomes.map((inc) => (
                  <tr key={inc._id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {inc.invoiceNumber || 'INV-N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{inc.projectId?.projectName || 'Project'}</p>
                      {inc.notes && <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{inc.notes}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{inc.clientId?.name || 'Client'}</p>
                      <p className="text-[11px] text-slate-400">{inc.clientId?.company}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(inc.paymentDate)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-700">
                        {inc.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-900 text-sm">
                      <span className={inc.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>
                        {formatCurrency(inc.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={inc.paymentStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewingInvoice(inc)}
                          title="View Invoice & Download PDF"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingIncome(inc);
                            setIsIncomeModalOpen(true);
                          }}
                          title="Edit Income Record"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingIncome(inc)}
                          title="Delete Record"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={incomes.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <EmptyState
          icon={DollarSign}
          title={search || projectFilter !== 'All' ? 'No income matches your filter' : 'No income records found'}
          description={
            search || projectFilter !== 'All'
              ? 'Try changing or clearing your search and filter parameters.'
              : 'Record incoming client payments or milestone deposits to track your revenue.'
          }
          actionLabel="Record Payment"
          onAction={() => {
            setEditingIncome(null);
            setIsIncomeModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => {
          setIsIncomeModalOpen(false);
          setEditingIncome(null);
        }}
        onSave={handleSaveIncome}
        income={editingIncome}
        projects={projects}
        clients={clients}
        isLoading={isSubmitting}
      />

      <InvoicePreviewModal
        isOpen={!!previewingInvoice}
        onClose={() => setPreviewingInvoice(null)}
        income={previewingInvoice}
      />

      <ConfirmDialog
        isOpen={!!deletingIncome}
        onClose={() => setDeletingIncome(null)}
        onConfirm={handleDeleteIncome}
        title="Delete Income Record?"
        message={`Are you sure you want to delete payment ${deletingIncome?.invoiceNumber} for ${formatCurrency(
          deletingIncome?.amount
        )}? Project paid amounts will be adjusted accordingly.`}
        confirmText="Delete Payment"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Income;
