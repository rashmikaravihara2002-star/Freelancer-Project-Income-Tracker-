import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import MonthlyIncomeChart from '../components/charts/MonthlyIncomeChart';
import ProjectStatusChart from '../components/charts/ProjectStatusChart';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ProjectDetailsModal from '../components/projects/ProjectDetailsModal';
import InvoicePreviewModal from '../components/income/InvoicePreviewModal';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Users,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [statusTotal, setStatusTotal] = useState(0);

  // Modals
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, monthlyRes, statusRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/monthly-income'),
        api.get('/dashboard/project-status'),
      ]);

      if (statsRes.data.success) {
        setStatsData(statsRes.data.data);
      }
      if (monthlyRes.data.success) {
        setMonthlyData(monthlyRes.data.data);
      }
      if (statusRes.data.success) {
        setStatusData(statusRes.data.data);
        setStatusTotal(statusRes.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading dashboard analytics..." />;
  }

  const summary = statsData?.summary || {
    activeProjects: 0,
    totalProjects: 0,
    totalIncome: 0,
    pendingPayments: 0,
    thisMonthIncome: 0,
    totalClients: 0,
  };

  const recentProjects = statsData?.recentProjects || [];
  const recentIncome = statsData?.recentIncome || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-brand-500/10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
            Freelancer Command Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Welcome, {user?.name || 'Freelancer'}! 🚀
          </h2>
          <p className="mt-1 text-sm text-brand-100 max-w-xl">
            Here is your financial and project health overview for this period.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/projects"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-700 font-semibold text-xs hover:bg-brand-50 shadow-sm transition-all"
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Projects</span>
          </Link>
          <Link
            to="/income"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-xs transition-all"
          >
            <DollarSign className="w-4 h-4" />
            <span>Record Income</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Projects"
          value={summary.activeProjects}
          subtitle={`${summary.totalProjects} total projects`}
          icon={Briefcase}
          color="blue"
        />

        <StatCard
          title="Total Projects"
          value={summary.totalProjects}
          subtitle={`${summary.completedProjects || 0} completed`}
          icon={CheckCircle}
          color="purple"
        />

        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          subtitle={`${formatCurrency(summary.thisMonthIncome)} received this month`}
          icon={DollarSign}
          color="emerald"
        />

        <StatCard
          title="Pending Payments"
          value={formatCurrency(summary.pendingPayments)}
          subtitle="Awaiting client settlement"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Financial Overview</h3>
              <p className="text-xs text-slate-400">Received income vs pending invoices by month</p>
            </div>
            <Link
              to="/income"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View details <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <MonthlyIncomeChart data={monthlyData} />
        </div>

        {/* Project Status Donut Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Projects by Status</h3>
              <p className="text-xs text-slate-400">Distribution across active workflow</p>
            </div>
          </div>
          <ProjectStatusChart data={statusData} total={statusTotal} />
        </div>
      </div>

      {/* Recent Activity Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Projects</h3>
              <p className="text-xs text-slate-400">Latest pipeline assignments</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Project / Client</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Fee</th>
                    <th className="pb-3 text-right">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentProjects.map((proj) => (
                    <tr
                      key={proj._id}
                      onClick={() => setSelectedProject(proj)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pr-2">
                        <p className="font-bold text-slate-800 truncate max-w-[160px]">
                          {proj.projectName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {proj.clientId?.name || 'Client'}
                        </p>
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={proj.status} />
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-slate-800">
                        {formatCurrency(proj.fee)}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <StatusBadge status={proj.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No projects created yet"
              description="Start by creating your first client project."
              actionLabel="Create Project"
              onAction={() => navigate('/projects')}
            />
          )}
        </div>

        {/* Recent Income Transactions */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
              <p className="text-xs text-slate-400">Latest received payments & remittances</p>
            </div>
            <Link
              to="/income"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentIncome.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Invoice & Project</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentIncome.map((inc) => (
                    <tr
                      key={inc._id}
                      onClick={() => setSelectedIncome(inc)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pr-2">
                        <p className="font-bold text-slate-800 truncate max-w-[160px]">
                          {inc.projectId?.projectName || 'Payment'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {inc.invoiceNumber} • {inc.paymentMethod}
                        </p>
                      </td>
                      <td className="py-3 px-2 text-slate-500 whitespace-nowrap">
                        {formatDate(inc.paymentDate)}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-emerald-600">
                        {formatCurrency(inc.amount)}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <StatusBadge status={inc.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No income recorded yet"
              description="Track your first incoming payment."
              actionLabel="Add Payment"
              onAction={() => navigate('/income')}
            />
          )}
        </div>
      </div>

      {/* Modals for Quick Details */}
      {selectedProject && (
        <ProjectDetailsModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}

      {selectedIncome && (
        <InvoicePreviewModal
          isOpen={!!selectedIncome}
          onClose={() => setSelectedIncome(null)}
          income={selectedIncome}
        />
      )}
    </div>
  );
};

export default Dashboard;
