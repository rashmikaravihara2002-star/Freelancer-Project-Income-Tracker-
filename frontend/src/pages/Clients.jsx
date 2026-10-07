import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import ClientModal from '../components/clients/ClientModal';
import ClientDetailsModal from '../components/clients/ClientDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { formatCurrency } from '../utils/formatters';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Briefcase,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Clients = () => {
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/clients${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (res.data.success) {
        setClients(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load clients list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClients();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      setIsClientModalOpen(true);
    }
  }, [location.search]);

  const handleSaveClient = async (formData, id) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const res = await api.put(`/clients/${id}`, formData);
        if (res.data.success) {
          toast.success('Client updated successfully');
          fetchClients();
          setIsClientModalOpen(false);
          setEditingClient(null);
        }
      } else {
        const res = await api.post('/clients', formData);
        if (res.data.success) {
          toast.success('Client added successfully');
          fetchClients();
          setIsClientModalOpen(false);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save client';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!deletingClient) return;
    try {
      setIsSubmitting(true);
      const res = await api.delete(`/clients/${deletingClient._id}`);
      if (res.data.success) {
        toast.success('Client and associated records deleted');
        fetchClients();
        setDeletingClient(null);
      }
    } catch (error) {
      toast.error('Failed to delete client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewClient = async (client) => {
    try {
      const res = await api.get(`/clients/${client._id}`);
      if (res.data.success) {
        setViewingClient(res.data.data);
      } else {
        setViewingClient(client);
      }
    } catch (error) {
      setViewingClient(client);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return clients.slice(start, start + itemsPerPage);
  }, [clients, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clients Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your client roster, communication details, and project history
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClient(null);
            setIsClientModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 shadow-sm shadow-brand-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-card">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by client name, email, company, phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total: <span className="text-slate-900">{clients.length}</span> clients
        </div>
      </div>

      {/* Clients Cards Grid */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading clients..." />
      ) : paginatedClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedClients.map((client) => (
            <div
              key={client._id}
              className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-100 shadow-card hover:shadow-card-hover hover:border-slate-200 transition-all duration-200 group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        {client.company || 'Individual'}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleViewClient(client)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingClient(client);
                        setIsClientModalOpen(true);
                      }}
                      title="Edit Client"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingClient(client)}
                      title="Delete Client"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact Items */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 pt-1 border-t border-slate-50">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Projects</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-brand-500" />
                    {client.projectCount || 0}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Paid</span>
                  <span className="font-bold text-emerald-600 truncate block">
                    {formatCurrency(client.totalPaid || 0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={search ? 'No clients match your search' : 'No clients found'}
          description={
            search
              ? `No results for "${search}". Try searching with a different term.`
              : 'Add your first client to start creating projects and tracking invoices.'
          }
          actionLabel="Add New Client"
          onAction={() => {
            setEditingClient(null);
            setIsClientModalOpen(true);
          }}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={clients.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        client={editingClient}
        isLoading={isSubmitting}
      />

      <ClientDetailsModal
        isOpen={!!viewingClient}
        onClose={() => setViewingClient(null)}
        client={viewingClient}
      />

      <ConfirmDialog
        isOpen={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        onConfirm={handleDeleteClient}
        title="Delete Client Profile?"
        message={`Are you sure you want to delete ${deletingClient?.name}? All associated projects and income records will also be removed.`}
        confirmText="Delete Client"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Clients;
