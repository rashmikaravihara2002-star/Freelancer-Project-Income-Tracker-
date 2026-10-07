import Income from '../models/Income.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';

// Helper function to recalculate project payment status based on all income records
const updateProjectPaymentStatus = async (userId, projectId) => {
  if (!projectId) return;

  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) return;

  const paidIncomes = await Income.find({
    userId,
    projectId,
    paymentStatus: 'Paid',
  });

  const totalPaid = paidIncomes.reduce((sum, item) => sum + item.amount, 0);
  project.paidAmount = totalPaid;

  if (totalPaid >= project.fee && project.fee > 0) {
    project.paymentStatus = 'Paid';
  } else if (totalPaid > 0 && totalPaid < project.fee) {
    project.paymentStatus = 'Partially Paid';
  } else {
    project.paymentStatus = 'Pending';
  }

  await project.save();
};

// @desc    Get all income records with search and filters
// @route   GET /api/income
// @access  Private
export const getIncome = async (req, res, next) => {
  try {
    const {
      search,
      projectId,
      clientId,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      sortBy = 'paymentDate',
      order = 'desc',
    } = req.query;

    let query = { userId: req.user._id };

    if (projectId && projectId !== 'All') {
      query.projectId = projectId;
    }

    if (clientId && clientId !== 'All') {
      query.clientId = clientId;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) {
        query.paymentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.paymentDate.$lte = end;
      }
    }

    const sortDirection = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortDirection };

    let incomes = await Income.find(query)
      .populate('projectId', 'projectName fee status paymentStatus')
      .populate('clientId', 'name email company')
      .sort(sortObj);

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      incomes = incomes.filter(
        (inc) =>
          (inc.invoiceNumber && searchRegex.test(inc.invoiceNumber)) ||
          (inc.notes && searchRegex.test(inc.notes)) ||
          (inc.paymentMethod && searchRegex.test(inc.paymentMethod)) ||
          (inc.projectId && searchRegex.test(inc.projectId.projectName)) ||
          (inc.clientId && searchRegex.test(inc.clientId.name)) ||
          (inc.clientId && searchRegex.test(inc.clientId.company))
      );
    }

    // Summary calculations
    const allUserIncome = await Income.find({ userId: req.user._id });
    const totalIncome = allUserIncome
      .filter((i) => i.paymentStatus === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0);

    const pendingIncome = allUserIncome
      .filter((i) => i.paymentStatus === 'Pending')
      .reduce((sum, i) => sum + i.amount, 0);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthIncome = allUserIncome
      .filter(
        (i) =>
          i.paymentStatus === 'Paid' &&
          new Date(i.paymentDate) >= currentMonthStart &&
          new Date(i.paymentDate) <= now
      )
      .reduce((sum, i) => sum + i.amount, 0);

    res.status(200).json({
      success: true,
      count: incomes.length,
      summary: {
        totalIncome,
        pendingIncome,
        thisMonthIncome,
        totalEntries: allUserIncome.length,
      },
      data: incomes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single income entry
// @route   GET /api/income/:id
// @access  Private
export const getIncomeById = async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate('projectId', 'projectName fee deadline status paymentStatus')
      .populate('clientId', 'name email company phone address');

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create income entry
// @route   POST /api/income
// @access  Private
export const createIncome = async (req, res, next) => {
  try {
    const {
      projectId,
      clientId,
      amount,
      paymentDate,
      paymentStatus,
      paymentMethod,
      invoiceNumber,
      notes,
    } = req.body;

    if (!projectId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Project and amount are required',
      });
    }

    // Verify project belongs to user
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project selected',
      });
    }

    const resolvedClientId = clientId || project.clientId;

    const income = await Income.create({
      userId: req.user._id,
      projectId,
      clientId: resolvedClientId,
      amount: Number(amount),
      paymentDate: paymentDate || Date.now(),
      paymentStatus: paymentStatus || 'Paid',
      paymentMethod: paymentMethod || 'Bank Transfer',
      invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      notes: notes ? notes.trim() : '',
    });

    // Update project paid amounts
    await updateProjectPaymentStatus(req.user._id, projectId);

    const populated = await Income.findById(income._id)
      .populate('projectId', 'projectName fee')
      .populate('clientId', 'name company');

    res.status(201).json({
      success: true,
      message: 'Income entry created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update income entry
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req, res, next) => {
  try {
    let income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    const oldProjectId = income.projectId;
    const {
      projectId,
      clientId,
      amount,
      paymentDate,
      paymentStatus,
      paymentMethod,
      invoiceNumber,
      notes,
    } = req.body;

    if (projectId) {
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id,
      });
      if (!project) {
        return res.status(400).json({
          success: false,
          message: 'Selected project not found',
        });
      }
      income.projectId = projectId;
      income.clientId = clientId || project.clientId;
    } else if (clientId) {
      income.clientId = clientId;
    }

    if (amount !== undefined) income.amount = Number(amount);
    if (paymentDate) income.paymentDate = new Date(paymentDate);
    if (paymentStatus) income.paymentStatus = paymentStatus;
    if (paymentMethod) income.paymentMethod = paymentMethod;
    if (invoiceNumber) income.invoiceNumber = invoiceNumber;
    if (notes !== undefined) income.notes = notes.trim();

    await income.save();

    // Recalculate status for old project and current project
    await updateProjectPaymentStatus(req.user._id, income.projectId);
    if (oldProjectId && oldProjectId.toString() !== income.projectId.toString()) {
      await updateProjectPaymentStatus(req.user._id, oldProjectId);
    }

    const populated = await Income.findById(income._id)
      .populate('projectId', 'projectName fee')
      .populate('clientId', 'name company');

    res.status(200).json({
      success: true,
      message: 'Income record updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income entry
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    const projectId = income.projectId;
    await income.deleteOne();

    // Recalculate project payment status
    await updateProjectPaymentStatus(req.user._id, projectId);

    res.status(200).json({
      success: true,
      message: 'Income record deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
