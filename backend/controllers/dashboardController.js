const Astrologer = require('../models/Astrologer');
const Consultation = require('../models/Consultation');
const Customer = require('../models/Customer');

const getStats = async (_req, res, next) => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 5);
    const [totalAstrologers, totalCustomers, totalConsultations, statusCounts, upcomingConsultations, recentConsultations] = await Promise.all([
      Astrologer.countDocuments(),
      Customer.countDocuments(),
      Consultation.countDocuments(),
      Consultation.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Consultation.countDocuments({
        status: 'Pending',
        $or: [
          { consultationDate: { $gt: new Date(`${today}T00:00:00.000Z`) } },
          { consultationDate: new Date(`${today}T00:00:00.000Z`), consultationTime: { $gte: currentTime } },
        ],
      }),
      Consultation.find().sort({ createdAt: -1 }).limit(5).populate('customerId', 'name').populate('astrologerId', 'name'),
    ]);
    const statusBreakdown = statusCounts.reduce(
      (acc, item) => ({ ...acc, [item._id]: item.count }),
      { Pending: 0, Completed: 0, Cancelled: 0 },
    );

    return res.json({
      totalAstrologers,
      totalCustomers,
      totalConsultations,
      upcomingConsultations,
      statusBreakdown,
      recentConsultations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
