import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/common/FormInput';
import { formatDate } from '../utils/formatters';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Lock,
  DollarSign,
  ShieldCheck,
  Calendar,
  Save,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    title: '',
    phone: '',
    company: '',
    address: '',
    bio: '',
    currency: 'USD',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        title: user.title || '',
        phone: user.phone || '',
        company: user.company || '',
        address: user.address || '',
        bio: user.bio || '',
        currency: user.currency || 'USD',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setIsProfileSubmitting(true);
    await updateProfile(profileData);
    setIsProfileSubmitting(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please provide both current and new password');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsPasswordSubmitting(true);
    const res = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );
    setIsPasswordSubmitting(false);

    if (res.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD ($) - US Dollar' },
    { value: 'EUR', label: 'EUR (€) - Euro' },
    { value: 'GBP', label: 'GBP (£) - British Pound' },
    { value: 'CAD', label: 'CAD ($) - Canadian Dollar' },
    { value: 'AUD', label: 'AUD ($) - Australian Dollar' },
    { value: 'INR', label: 'INR (₹) - Indian Rupee' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account & Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update personal details, company billing information, and security credentials
        </p>
      </div>

      {/* User Header Profile Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-brand-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold">{user?.name}</h3>
            <p className="text-xs text-slate-300">{user?.title || 'Freelance Specialist'}</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Member Since
          </span>
          <p className="text-xs font-semibold text-slate-200 mt-0.5">
            {formatDate(user?.createdAt, 'MMMM yyyy')}
          </p>
          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            Verified Account
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-card border border-slate-100">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            Personal & Freelance Information
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            This information will appear on generated invoices and client reports
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="Your Full Name"
              icon={User}
              required
            />
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              disabled
              icon={Mail}
              helperText="Email cannot be changed directly"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Professional Title"
              name="title"
              value={profileData.title}
              onChange={handleProfileChange}
              placeholder="e.g. Senior Full Stack Engineer"
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              placeholder="+1 (555) 000-0000"
              icon={Phone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Studio / Business Name"
              name="company"
              value={profileData.company}
              onChange={handleProfileChange}
              placeholder="e.g. Apex Code Studio"
              icon={Building}
            />
            <FormInput
              label="Default Currency"
              name="currency"
              type="select"
              value={profileData.currency}
              onChange={handleProfileChange}
              options={currencyOptions}
              icon={DollarSign}
            />
          </div>

          <FormInput
            label="Business Address"
            name="address"
            value={profileData.address}
            onChange={handleProfileChange}
            placeholder="City, State, Country"
            icon={MapPin}
          />

          <FormInput
            label="Bio / Professional Overview"
            name="bio"
            type="textarea"
            value={profileData.bio}
            onChange={handleProfileChange}
            placeholder="Brief bio or skill overview..."
            rows={3}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isProfileSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 shadow-sm shadow-brand-200 transition-all disabled:opacity-50"
            >
              {isProfileSubmitting ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-card border border-slate-100">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-600" />
            Security & Password
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ensure your account is using a long, secure password
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <FormInput
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="At least 6 characters"
              icon={Lock}
              required
            />
            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
              icon={Lock}
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-900 shadow-sm transition-all disabled:opacity-50"
            >
              {isPasswordSubmitting ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>Change Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
