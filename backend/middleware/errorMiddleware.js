const fieldMap = {
  customerId: 'customer_id',
  astrologerId: 'astrologer_id',
  consultationDate: 'consultation_date',
  consultationTime: 'consultation_time',
};

const notFound = (_req, res) => {
  res.status(404).json({ message: 'Resource not found.' });
};

const errorHandler = (error, _req, res, _next) => {
  if (error.name === 'CastError') {
    return res.status(404).json({ message: 'Resource not found.' });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'email';
    return res.status(400).json({ errors: { [fieldMap[field] || field]: 'Value must be unique.' } });
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).reduce((acc, item) => {
      acc[fieldMap[item.path] || item.path] = item.message;
      return acc;
    }, {});
    return res.status(400).json({ errors });
  }

  console.error(error);
  return res.status(500).json({ message: 'Unexpected server error.' });
};

module.exports = { errorHandler, notFound };
