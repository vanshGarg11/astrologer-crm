const Astrologer = require('../models/Astrologer');
const Consultation = require('../models/Consultation');
const Customer = require('../models/Customer');
const { createNotification, recordActivity } = require('../utils/activity');
const { getPagination, paginatedResponse } = require('../utils/query');
const { validators, validate } = require('../utils/validation');

const normalizeConsultationPayload = (body) => ({
  customerId: body.customerId || body.customer_id,
  astrologerId: body.astrologerId || body.astrologer_id,
  consultationDate: body.consultationDate || body.consultation_date,
  consultationTime: body.consultationTime || body.consultation_time,
  status: body.status,
  notes: body.notes || '',
});

const withRelations = (query) => query.populate('customerId', 'name').populate('astrologerId', 'name');

const listConsultations = async (req, res, next) => {
  try {
    const { status = '', search = '' } = req.query;
    const { page, limit, skip } = getPagination(req.query);
    const filter = status ? { status } : {};
    let consultations = await withRelations(Consultation.find(filter).sort({ createdAt: -1 }));

    if (search) {
      const needle = search.toLowerCase();
      consultations = consultations.filter((item) => {
        const customerName = item.customerId?.name || '';
        const astrologerName = item.astrologerId?.name || '';
        return `${customerName} ${astrologerName} ${item.notes}`.toLowerCase().includes(needle);
      });
    }

    const total = consultations.length;
    res.json(paginatedResponse(consultations.slice(skip, skip + limit), total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getConsultation = async (req, res, next) => {
  try {
    const consultation = await withRelations(Consultation.findById(req.params.id));
    if (!consultation) return res.status(404).json({ message: 'Consultation not found.' });
    return res.json(consultation);
  } catch (error) {
    next(error);
  }
};

const validateRelations = async (payload) => {
  const errors = {};
  const customer = payload.customerId ? await Customer.findById(payload.customerId) : null;
  const astrologer = payload.astrologerId ? await Astrologer.findById(payload.astrologerId) : null;
  if (!customer) {
    errors.customer_id = 'Customer does not exist.';
  }
  if (!astrologer) {
    errors.astrologer_id = 'Astrologer does not exist.';
  }

  if (customer && astrologer && payload.consultationDate && payload.consultationTime) {
    const date = new Date(`${payload.consultationDate}T00:00:00.000Z`);
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getUTCDay()];
    if (!astrologer.availableDays.includes(dayName)) {
      errors.consultation_date = `${astrologer.name} is not available on ${dayName}.`;
    }
    if (!astrologer.timeSlots.includes(payload.consultationTime)) {
      errors.consultation_time = 'Selected time slot is not available.';
    }
    const existing = await Consultation.findOne({
      astrologerId: payload.astrologerId,
      consultationDate: date,
      consultationTime: payload.consultationTime,
      status: { $ne: 'Cancelled' },
      ...(payload.currentId ? { _id: { $ne: payload.currentId } } : {}),
    });
    if (existing) errors.consultation_time = 'This slot is already booked.';
  }

  return { errors, customer, astrologer };
};

const createConsultation = async (req, res, next) => {
  try {
    const payload = normalizeConsultationPayload(req.body);
    
    const errors = validate(payload, {
      customerId: (v) => validators.required(v, 'customer_id'),
      astrologerId: (v) => validators.required(v, 'astrologer_id'),
      consultationDate: [
        (v) => validators.required(v, 'consultation_date'),
        (v) => validators.date(v, 'consultation_date'),
      ],
      consultationTime: (v) => validators.required(v, 'consultation_time'),
      status: (v) => validators.required(v, 'status'),
    });

    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }

    const { errors: relationErrors, customer, astrologer } = await validateRelations(payload);
    if (Object.keys(relationErrors).length) return res.status(400).json({ errors: relationErrors });

    const consultation = await Consultation.create(payload);
    await recordActivity({
      type: 'Consultation Created',
      message: `Consultation created for ${customer.name} with ${astrologer.name}.`,
      entityType: 'Consultation',
      entityId: consultation.id,
    });
    await createNotification({
      title: 'Consultation created',
      message: `${customer.name} is scheduled with ${astrologer.name}.`,
      type: 'info',
      entityType: 'Consultation',
      entityId: consultation.id,
    });
    const populated = await withRelations(Consultation.findById(consultation.id));
    return res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const updateConsultation = async (req, res, next) => {
  try {
    const payload = normalizeConsultationPayload(req.body);
    payload.currentId = req.params.id;
    const { errors: relationErrors } = await validateRelations(payload);
    if (Object.keys(relationErrors).length) return res.status(400).json({ errors: relationErrors });
    delete payload.currentId;

    const consultation = await Consultation.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!consultation) return res.status(404).json({ message: 'Consultation not found.' });
    await recordActivity({
      type: 'Consultation Updated',
      message: `Consultation status is now ${consultation.status}.`,
      entityType: 'Consultation',
      entityId: consultation.id,
    });
    if (consultation.status === 'Cancelled') {
      await createNotification({
        title: 'Consultation cancelled',
        message: 'A consultation was marked as cancelled.',
        type: 'warning',
        entityType: 'Consultation',
        entityId: consultation.id,
      });
    }

    const populated = await withRelations(Consultation.findById(consultation.id));
    return res.json(populated);
  } catch (error) {
    next(error);
  }
};

const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found.' });
    return res.json({ message: 'Consultation deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listConsultations,
  getConsultation,
  createConsultation,
  updateConsultation,
  deleteConsultation,
};
