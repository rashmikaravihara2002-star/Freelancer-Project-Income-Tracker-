import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Income from '../models/Income.js';

// @desc    Get all projects for user with search, filter, and pagination
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const { search, status, clientId, paymentStatus, sortBy = 'createdAt', order = 'desc' } = req.query;

    let query = { userId: req.user._id };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { projectName: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (clientId && clientId !== 'All') {
      query.clientId = clientId;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    const sortDirection = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortDirection };

    const projects = await Project.find(query)
      .populate('clientId', 'name email company phone')
      .sort(sortObj);

    // Calculate dynamic paidAmount and remaining balance for each project from actual Income records
    const populatedProjects = await Promise.all(
      projects.map(async (p) => {
        const incomeRecords = await Income.find({
          userId: req.user._id,
          projectId: p._id,
          paymentStatus: 'Paid',
        });
        const totalPaid = incomeRecords.reduce((sum, item) => sum + item.amount, 0);
        const pendingRecords = await Income.find({
          userId: req.user._id,
          projectId: p._id,
          paymentStatus: 'Pending',
        });
        const totalPending = pendingRecords.reduce((sum, item) => sum + item.amount, 0);

        let dynamicPaymentStatus = p.paymentStatus;
        if (totalPaid >= p.fee && p.fee > 0) {
          dynamicPaymentStatus = 'Paid';
        } else if (totalPaid > 0 && totalPaid < p.fee) {
          dynamicPaymentStatus = 'Partially Paid';
        } else {
          dynamicPaymentStatus = 'Pending';
        }

        return {
          ...p.toObject(),
          paidAmount: totalPaid,
          pendingIncomeAmount: totalPending,
          remainingBalance: Math.max(0, p.fee - totalPaid),
          calculatedPaymentStatus: dynamicPaymentStatus,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: populatedProjects.length,
      data: populatedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('clientId', 'name email company phone address');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const incomePayments = await Income.find({
      userId: req.user._id,
      projectId: project._id,
    }).sort({ paymentDate: -1 });

    const totalPaid = incomePayments
      .filter((i) => i.paymentStatus === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        ...project.toObject(),
        paidAmount: totalPaid,
        remainingBalance: Math.max(0, project.fee - totalPaid),
        payments: incomePayments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const {
      clientId,
      projectName,
      description,
      startDate,
      deadline,
      status,
      fee,
      paymentStatus,
      category,
      priority,
    } = req.body;

    if (!projectName || !clientId || !deadline || fee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Project name, client, deadline, and fee are required',
      });
    }

    // Verify client belongs to current user
    const client = await Client.findOne({
      _id: clientId,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client selected or client does not exist',
      });
    }

    const project = await Project.create({
      userId: req.user._id,
      clientId,
      projectName: projectName.trim(),
      description: description ? description.trim() : '',
      startDate: startDate || Date.now(),
      deadline: new Date(deadline),
      status: status || 'In Progress',
      fee: Number(fee),
      paymentStatus: paymentStatus || 'Pending',
      category: category || 'Web Development',
      priority: priority || 'Medium',
    });

    const populated = await Project.findById(project._id).populate(
      'clientId',
      'name email company'
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const {
      clientId,
      projectName,
      description,
      startDate,
      deadline,
      status,
      fee,
      paymentStatus,
      category,
      priority,
    } = req.body;

    if (clientId) {
      const client = await Client.findOne({
        _id: clientId,
        userId: req.user._id,
      });
      if (!client) {
        return res.status(400).json({
          success: false,
          message: 'Selected client not found',
        });
      }
      project.clientId = clientId;
    }

    if (projectName) project.projectName = projectName.trim();
    if (description !== undefined) project.description = description.trim();
    if (startDate) project.startDate = new Date(startDate);
    if (deadline) project.deadline = new Date(deadline);
    if (status) project.status = status;
    if (fee !== undefined) project.fee = Number(fee);
    if (paymentStatus) project.paymentStatus = paymentStatus;
    if (category !== undefined) project.category = category;
    if (priority) project.priority = priority;

    await project.save();

    const updated = await Project.findById(project._id).populate(
      'clientId',
      'name email company'
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Delete associated income payments
    await Income.deleteMany({ userId: req.user._id, projectId: project._id });
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project and associated income records deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
