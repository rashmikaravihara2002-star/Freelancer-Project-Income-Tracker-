import React, { useState, useRef, useEffect } from 'react';
import { Menu, Plus, Bell, ChevronDown, User, LogOut, Briefcase, Users, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenSidebar, title = 'Dashboard', onQuickAction }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const plusMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setIsPlusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Quick Add Menu */}
        <div className="relative" ref={plusMenuRef}>
          <button
            onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-sm shadow-brand-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Record</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          </button>

          {isPlusMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 z-50 animate-in fade-in duration-150">
              <button
                onClick={() => {
                  setIsPlusMenuOpen(false);
                  if (onQuickAction) onQuickAction('add-client');
                  else navigate('/clients?action=new');
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Users className="w-4 h-4 text-blue-500" />
                <span>Add Client</span>
              </button>
              <button
                onClick={() => {
                  setIsPlusMenuOpen(false);
                  if (onQuickAction) onQuickAction('add-project');
                  else navigate('/projects?action=new');
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>Add Project</span>
              </button>
              <button
                onClick={() => {
                  setIsPlusMenuOpen(false);
                  if (onQuickAction) onQuickAction('add-income');
                  else navigate('/income?action=new');
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Add Income / Payment</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden md:block text-xs font-semibold text-slate-700">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
                <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Account & Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
