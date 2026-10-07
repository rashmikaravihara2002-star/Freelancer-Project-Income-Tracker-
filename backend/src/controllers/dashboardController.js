import Project from '../models/Project.js';
import Income from '../models/Income.js';
import Client from '../models/Client.js';

// @desc    Get dashboard summary statistics and recent records
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Projects stats
    const totalProjects = await Project.countDocuments({ userId });
    const activeProjects = await Project.countDocuments({
      userId,
      status: { $in: ['In Progress', 'Pending'] },
    });
    const completedProjects = await Project.countDocuments({
      userId,
      status: 'Completed',
    });
    const totalClients = await Client.countDocuments({ userId });

    // 2. Income aggregation
    const paidIncomeAgg = await Income.aggregate([
      { $match: { userId, paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalIncome = paidIncomeAgg.length > 0 ? paidIncomeAgg[0].total : 0;

    // Pending payments from pending income items + unpaid project balances
    const pendingIncomeAgg = await Income.aggregate([
      { $match: { userId, paymentStatus: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const pendingIncomeRecords =
      pendingIncomeAgg.length > 0 ? pendingIncomeAgg[0].total : 0;

    // Total Project Fees minus Total Paid Income = Total Unpaid/Pending
    const allProjects = await Project.find({ userId });
    const totalContractValue = allProjects.reduce((sum, p) => sum + p.fee, 0);
    const pendingPayments = Math.max(0, totalContractValue - totalIncome);

    // 3. Recent 5 projects
    const recentProjects = await Project.find({ userId })
      .populate('clientId', 'name email company')
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Recent 5 income entries
    const recentIncome = await Income.find({ userId })
      .populate('projectId', 'projectName fee')
      .populate('clientId', 'name company')
      .sort({ paymentDate: -1 })
      .limit(5);

    // Calculate this month's income
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthPaidAgg = await Income.aggregate([
      {
        $match: {
          userId,
          paymentStatus: 'Paid',
          paymentDate: { $gte: startOfMonth, $lte: now },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const thisMonthIncome =
      thisMonthPaidAgg.length > 0 ? thisMonthPaidAgg[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          activeProjects,
          totalProjects,
          completedProjects,
          totalClients,
          totalIncome,
          pendingPayments: pendingPayments > 0 ? pendingPayments : pendingIncomeRecords,
          thisMonthIncome,
          totalContractValue,
        },
        recentProjects,
        recentIncome,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly income breakdown for the past 6-12 months
// @route   GET /api/dashboard/monthly-income
// @access  Private
export const getMonthlyIncome = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const monthsData = [];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Generate last 6 months list
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const paidAgg = await Income.aggregate([
        {
          $match: {
            userId,
            paymentStatus: 'Paid',
            paymentDate: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const pendingAgg = await Income.aggregate([
        {
          $match: {
            userId,
            paymentStatus: 'Pending',
            paymentDate: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      monthsData.push({
        month: monthNames[d.getMonth()],
        fullMonth: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        year: d.getFullYear(),
        income: paidAgg.length > 0 ? paidAgg[0].total : 0,
        pending: pendingAgg.length > 0 ? pendingAgg[0].total : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: monthsData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project status breakdown for pie chart
// @route   GET /api/dashboard/project-status
// @access  Private
export const getProjectStatusStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const statuses = ['In Progress', 'Pending', 'Completed', 'Cancelled'];
    const statusCounts = await Promise.all(
      statuses.map(async (status) => {
        const count = await Project.countDocuments({ userId, status });
        return {
          name: status,
          value: count,
        };
      })
    );

    const total = statusCounts.reduce((acc, curr) => acc + curr.value, 0);

    const dataWithPercentage = statusCounts.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
    }));

    res.status(200).json({
      success: true,
      total,
      data: dataWithPercentage,
    });
  } catch (error) {
    next(error);
  }
};
