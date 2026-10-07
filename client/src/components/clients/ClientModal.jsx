import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import { User, Mail, Phone, Building, Globe, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientModal = ({ isOpen, onClose, onSave, client = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    website: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        address: client.address || '',
        website: client.website || '',
        notes: client.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        website: '',
        notes: '',
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Client name is required';
    if (!formData.email.trim()) {
      errs.email = 'Client email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData, client?._id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Edit Client Profile' : 'Add New Client'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Client Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sarah Jenkins"
            icon={User}
            required
            error={errors.name}
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="client@company.com"
            icon={Mail}
            required
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Company / Organization"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. FintechFlow Inc"
            icon={Building}
          />
          <FormInput
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            icon={Phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            icon={Globe}
          />
          <FormInput
            label="Address / Location"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="City, Country"
            icon={MapPin}
          />
        </div>

        <FormInput
          label="Notes / Brief"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Key contact preferences, project background notes..."
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
            {client ? 'Update Client' : 'Save Client'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;
