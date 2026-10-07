import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import { Briefcase, Calendar, DollarSign, Tag, Flag } from 'lucide-react';
import { format } from 'date-fns';

const ProjectModal = ({
  isOpen,
  onClose,
  onSave,
  project = null,
  clients = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    clientId: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    deadline: '',
    status: 'In Progress',
    fee: '',
    paymentStatus: 'Pending',
    priority: 'Medium',
    category: 'Web Development',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || '',
        clientId: project.clientId?._id || project.clientId || '',
        description: project.description || '',
        startDate: project.startDate
          ? format(new Date(project.startDate), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        deadline: project.deadline
          ? format(new Date(project.deadline), 'yyyy-MM-dd')
          : '',
        status: project.status || 'In Progress',
        fee: project.fee !== undefined ? project.fee : '',
        paymentStatus: project.paymentStatus || 'Pending',
        priority: project.priority || 'Medium',
        category: project.category || 'Web Development',
      });
    } else {
      setFormData({
        projectName: '',
        clientId: clients.length > 0 ? clients[0]._id : '',
        description: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        deadline: '',
        status: 'In Progress',
        fee: '',
        paymentStatus: 'Pending',
        priority: 'Medium',
        category: 'Web Development',
      });
    }
    setErrors({});
  }, [project, clients, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.projectName.trim()) errs.projectName = 'Project name is required';
    if (!formData.clientId) errs.clientId = 'Please select a client';
    if (!formData.deadline) errs.deadline = 'Project deadline is required';
    if (formData.fee === '' || Number(formData.fee) < 0) {
      errs.fee = 'Please enter a valid positive fee';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData, project?._id);
  };

  const clientOptions = [
    { value: '', label: '-- Select a Client --' },
    ...clients.map((c) => ({
      value: c._id,
      label: `${c.name} ${c.company ? `(${c.company})` : ''}`,
    })),
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Partially Paid', label: 'Partially Paid' },
    { value: 'Paid', label: 'Paid' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' },
    { value: 'Urgent', label: 'Urgent Priority' },
  ];

  const categoryOptions = [
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'SaaS Platform', label: 'SaaS Platform' },
    { value: 'E-Commerce', label: 'E-Commerce' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Security & DevOps', label: 'Security & DevOps' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project Details' : 'Create New Project'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Project Name"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="e.g. Modern E-Commerce Web App"
          icon={Briefcase}
          required
          error={errors.projectName}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Client"
            name="clientId"
            type="select"
            value={formData.clientId}
            onChange={handleChange}
            options={clientOptions}
            required
            error={errors.clientId}
          />
          <FormInput
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            icon={Tag}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            icon={Calendar}
          />
          <FormInput
            label="Deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            icon={Calendar}
            required
            error={errors.deadline}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="Project Fee ($)"
            name="fee"
            type="number"
            min="0"
            step="0.01"
            value={formData.fee}
            onChange={handleChange}
            placeholder="0.00"
            icon={DollarSign}
            required
            error={errors.fee}
          />
          <FormInput
            label="Project Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
          <FormInput
            label="Priority"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={handleChange}
            options={priorityOptions}
            icon={Flag}
          />
        </div>

        <FormInput
          label="Payment Status"
          name="paymentStatus"
          type="select"
          value={formData.paymentStatus}
          onChange={handleChange}
          options={paymentStatusOptions}
          helperText="Payment status will also auto-sync as you record income payments"
        />

        <FormInput
          label="Project Description / Deliverables"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Scope of work, deliverables, tech stack, milestones..."
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
            {project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
