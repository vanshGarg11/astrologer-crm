const Consultation = require('../models/Consultation');
const Customer = require('../models/Customer');
const { recordActivity } = require('../utils/activity');
const { escapeRegex, getPagination, paginatedResponse } = require('../utils/query');
const { validators, validate } = require('../utils/validation');

const listCustomers = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const { page, limit, skip } = getPagination(req.query);
    const regex = { $regex: escapeRegex(search), $options: 'i' };
    const filter = search ? { $or: [{ name: regex }, { email: regex }, { phone: regex }, { city: regex }] } : {};
    const [customers, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Customer.countDocuments(filter),
    ]);
    res.json(paginatedResponse(customers, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });
    return res.json(customer);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const errors = validate(req.body, {
      name: (v) => validators.required(v, 'name'),
      phone: [
        (v) => validators.required(v, 'phone'),
        (v) => validators.phone(v, 'phone'),
      ],
      email: [
        (v) => validators.required(v, 'email'),
        (v) => validators.email(v, 'email'),
      ],
      dob: [
        (v) => validators.required(v, 'dob'),
        (v) => validators.date(v, 'dob'),
      ],
      city: (v) => validators.required(v, 'city'),
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });
    await recordActivity({
      type: 'Customer Updated',
      message: `${customer.name} profile was updated by admin.`,
      entityType: 'Customer',
      entityId: customer.id,
    });
    return res.json(customer);
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });
    await Consultation.deleteMany({ customerId: req.params.id });
    return res.json({ message: 'Customer deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
