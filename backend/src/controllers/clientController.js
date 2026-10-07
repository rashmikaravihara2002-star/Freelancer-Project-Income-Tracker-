import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Income from '../models/Income.js';

// @desc    Get all clients for logged in user with search & project counts
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
        { phone: searchRegex },
      ];
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });

    // Aggregate projects and total revenue for each client
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const projectCount = await Project.countDocuments({
          userId: req.user._id,
          clientId: client._id,
        });

        const activeProjectCount = await Project.countDocuments({
          userId: req.user._id,
          clientId: client._id,
          status: { $in: ['In Progress', 'Pending'] },
        });

        const incomeAgg = await Income.aggregate([
          { $match: { userId: req.user._id, clientId: client._id, paymentStatus: 'Paid' } },
          { $group: { _id: null, totalPaid: { $sum: '$amount' } } },
        ]);

        const totalPaid = incomeAgg.length > 0 ? incomeAgg[0].totalPaid : 0;

        return {
          ...client.toObject(),
          projectCount,
          activeProjectCount,
          totalPaid,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: clientsWithStats.length,
      data: clientsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client by ID
// @route   GET /api/clients/:id
// @access  Private
export const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    const projects = await Project.find({
      userId: req.user._id,
      clientId: client._id,
    }).sort({ createdAt: -1 });

    const income = await Income.find({
      userId: req.user._id,
      clientId: client._id,
    }).sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...client.toObject(),
        projects,
        income,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
export const createClient = async (req, res, next) => {
  try {
    const { name, email, phone, company, address, website, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Client name and email are required',
      });
    }

    // Check if client with this email already exists for this user
    const existingClient = await Client.findOne({
      userId: req.user._id,
      email: email.toLowerCase(),
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'A client with this email already exists in your contacts',
      });
    }

    const client = await Client.create({
      userId: req.user._id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      address: address ? address.trim() : '',
      website: website ? website.trim() : '',
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res, next) => {
  try {
    const { name, email, phone, company, address, website, notes } = req.body;

    let client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    if (email && email.toLowerCase() !== client.email) {
      const duplicate = await Client.findOne({
        userId: req.user._id,
        email: email.toLowerCase(),
        _id: { $ne: client._id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Another client already exists with this email address',
        });
      }
    }

    if (name) client.name = name.trim();
    if (email) client.email = email.toLowerCase().trim();
    if (phone !== undefined) client.phone = phone.trim();
    if (company !== undefined) client.company = company.trim();
    if (address !== undefined) client.address = address.trim();
    if (website !== undefined) client.website = website.trim();
    if (notes !== undefined) client.notes = notes.trim();

    const updatedClient = await client.save();

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Cascade delete or clean up related projects and income
    await Project.deleteMany({ userId: req.user._id, clientId: client._id });
    await Income.deleteMany({ userId: req.user._id, clientId: client._id });

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Client and associated projects/records deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
