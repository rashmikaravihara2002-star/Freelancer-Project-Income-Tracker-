import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectDetailsModal from '../components/projects/ProjectDetailsModal';
import IncomeModal from '../components/income/IncomeModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  User,
  ArrowUpDown,
  CreditCard,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Projects = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeTargetProject, setIncomeTargetProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      if (res.data.success) {
        setClients(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (statusFilter !== 'All') queryParams.append('status', statusFilter);
      if (clientFilter !== 'All') queryParams.append('clientId', clientFilter);
      if (paymentFilter !== 'All') queryParams.append('paymentStatus', paymentFilter);

      const res = await api.get(`/projects?${queryParams.toString()}`);
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, clientFilter, paymentFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      setIsProjectModalOpen(true);
    }
  }, [location.search]);

  const handleSaveProject = async (formData, id) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const res = await api.put(`/projects/${id}`, formData);
        if (res.data.success) {
          toast.success('Project updated successfully');
          fetchProjects();
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }
      } else {
        const res = await api.post('/projects', formData);
        if (res.data.success) {
          toast.success('Project created successfully');
          fetchProjects();
          setIsProjectModalOpen(false);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save project';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    try {
      setIsSubmitting(true);
      const res = await api.delete(`/projects/${deletingProject._id}`);
      if (res.data.success) {
        toast.success('Project and associated records deleted');
        fetchProjects();
        setDeletingProject(null);
      }
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveIncome = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await api.post('/income', formData);
      if (res.data.success) {
        toast.success('Payment recorded successfully');
        setIsIncomeModalOpen(false);
        setIncomeTargetProject(null);
        fetchProjects();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to record payment';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProject = async (project) => {
    try {
      const res = await api.get(`/projects/${project._id}`);
      if (res.data.success) {
        setViewingProject(res.data.data);
      } else {
        setViewingProject(project);
      }
    } catch (error) {
      setViewingProject(project);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return projects.slice(start, start + itemsPerPage);
  }, [projects, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Project Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track contracts, delivery milestones, budgets, and client progress
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProject(null);
            setIsProjectModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 shadow-sm shadow-brand-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Client Filter */}
          <div>
            <select
              value={clientFilter}
              onChange={(e) => {
                setClientFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="All">All Clients</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none"
            >
              <option value="All">All Payment States</option>
              <option value="Pending">Unpaid / Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Fully Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading projects..." />
      ) : paginatedProjects.length > 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4 text-right">Fee / Balance</th>
                  <th className="py-3.5 px-4 text-center">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProjects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Project Name & Category */}
                    <td className="py-3.5 px-4">
                      <div>
                        <button
                          onClick={() => handleViewProject(proj)}
                          className="font-bold text-slate-900 hover:text-brand-600 transition-colors text-left block"
                        >
                          {proj.projectName}
                        </button>
                        <span className="text-[10px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block">
                          {proj.category || 'General'}
                        </span>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{proj.clientId?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-slate-400">{proj.clientId?.company}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={proj.status} />
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(proj.deadline)}</span>
                      </div>
                    </td>

                    {/* Fee & Paid */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <p className="font-bold text-slate-900">{formatCurrency(proj.fee)}</p>
                      <p className="text-[11px] text-slate-400">
                        Paid: <span className="text-emerald-600 font-semibold">{formatCurrency(proj.paidAmount || 0)}</span>
                      </p>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={proj.paymentStatus || proj.calculatedPaymentStatus} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setIncomeTargetProject(proj);
                            setIsIncomeModalOpen(true);
                          }}
                          title="Record Payment"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewProject(proj)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          title="Edit Project"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProject(proj)}
                          title="Delete Project"
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
            totalItems={projects.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title={search || statusFilter !== 'All' ? 'No matching projects found' : 'No projects recorded'}
          description={
            search || statusFilter !== 'All'
              ? 'Try changing or clearing your search and filter criteria.'
              : 'Add your first project to start tracking your deliverables, timelines, and fees.'
          }
          actionLabel="Create Project"
          onAction={() => {
            setEditingProject(null);
            setIsProjectModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
        clients={clients}
        isLoading={isSubmitting}
      />

      <ProjectDetailsModal
        isOpen={!!viewingProject}
        onClose={() => setViewingProject(null)}
        project={viewingProject}
        onAddPayment={(proj) => {
          setIncomeTargetProject(proj);
          setIsIncomeModalOpen(true);
        }}
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => {
          setIsIncomeModalOpen(false);
          setIncomeTargetProject(null);
        }}
        onSave={handleSaveIncome}
        projects={projects}
        clients={clients}
        preselectedProject={incomeTargetProject}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deletingProject?.projectName}"? Associated payment records will also be deleted.`}
        confirmText="Delete Project"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Projects;
