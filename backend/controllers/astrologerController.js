const Consultation = require('../models/Consultation');
const Astrologer = require('../models/Astrologer');
const { recordActivity } = require('../utils/activity');
const { escapeRegex, getPagination, paginatedResponse } = require('../utils/query');
const { validators, validate } = require('../utils/validation');

const listAstrologers = async (req, res, next) => {
  try {
    const { search = '', specialization = '' } = req.query;
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};
    if (search) {
      const regex = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [{ name: regex }, { specialization: regex }, { languages: regex }, { email: regex }, { phone: regex }];
    }
    if (specialization) filter.specialization = specialization;

    const [astrologers, total] = await Promise.all([
      Astrologer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Astrologer.countDocuments(filter),
    ]);
    res.json(paginatedResponse(astrologers, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getAstrologer = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.findById(req.params.id);
    if (!astrologer) return res.status(404).json({ message: 'Astrologer not found.' });
    return res.json(astrologer);
  } catch (error) {
    next(error);
  }
};

const createAstrologer = async (req, res, next) => {
  try {
    const errors = validate(req.body, {
      name: (v) => validators.required(v, 'name'),
      specialization: (v) => validators.required(v, 'specialization'),
      experience: [
        (v) => validators.required(v, 'experience'),
        (v) => validators.number(v, 'experience'),
      ],
      languages: (v) => validators.required(v, 'languages'),
      rating: [
        (v) => validators.required(v, 'rating'),
        (v) => validators.numberRange(v, 1, 5, 'rating'),
      ],
      phone: [
        (v) => validators.required(v, 'phone'),
        (v) => validators.phone(v, 'phone'),
      ],
      email: [
        (v) => validators.required(v, 'email'),
        (v) => validators.email(v, 'email'),
      ],
      status: (v) => validators.required(v, 'status'),
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const astrologer = await Astrologer.create(req.body);
    await recordActivity({
      type: 'Astrologer Added',
      message: `${astrologer.name} was added as an astrologer.`,
      entityType: 'Astrologer',
      entityId: astrologer.id,
    });
    res.status(201).json(astrologer);
  } catch (error) {
    next(error);
  }
};

const updateAstrologer = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!astrologer) return res.status(404).json({ message: 'Astrologer not found.' });
    return res.json(astrologer);
  } catch (error) {
    next(error);
  }
};

const deleteAstrologer = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.findByIdAndDelete(req.params.id);
    if (!astrologer) return res.status(404).json({ message: 'Astrologer not found.' });
    await Consultation.deleteMany({ astrologerId: req.params.id });
    return res.json({ message: 'Astrologer deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listAstrologers,
  getAstrologer,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
};
