import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Mail, Phone, Building, Globe, MapPin, Briefcase, DollarSign } from 'lucide-react';

const ClientDetailsModal = ({ isOpen, onClose, client }) => {
  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Client Profile Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Profile Info */}
        <div className="flex items-start justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center shadow-sm shadow-brand-200">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">{client.name}</h4>
              <p className="text-xs text-slate-500">{client.company || 'Individual Client'}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase font-bold text-slate-400">Total Billed</span>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(client.totalPaid || 0)}</p>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
            <Mail className="w-4 h-4 text-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 font-medium">Email</p>
              <a href={`mailto:${client.email}`} className="text-slate-800 hover:text-brand-600 truncate font-semibold block">
                {client.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
            <Phone className="w-4 h-4 text-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 font-medium">Phone</p>
              <p className="text-slate-800 font-semibold truncate">{client.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
            <Globe className="w-4 h-4 text-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 font-medium">Website</p>
              {client.website ? (
                <a href={client.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline truncate font-semibold block">
                  {client.website}
                </a>
              ) : (
                <p className="text-slate-400">Not provided</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
            <MapPin className="w-4 h-4 text-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 font-medium">Address</p>
              <p className="text-slate-800 font-semibold truncate">{client.address || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {client.notes && (
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs">
            <p className="font-semibold text-amber-800 mb-1">Notes & Preferences</p>
            <p className="text-amber-900/80 leading-relaxed whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}

        {/* Projects List if populated */}
        {client.projects && client.projects.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Associated Projects ({client.projects.length})
            </h5>
            <div className="space-y-2">
              {client.projects.map((proj) => (
                <div key={proj._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{proj.projectName}</p>
                    <p className="text-[11px] text-slate-400">Deadline: {formatDate(proj.deadline)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={proj.status} />
                    <span className="font-bold text-slate-800">{formatCurrency(proj.fee)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

export default ClientDetailsModal;
