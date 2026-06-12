const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 25, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const paginatedResponse = (items, total, page, limit) => ({
  data: items,
  meta: {
    page,
    limit,
    total,
    pages: Math.max(Math.ceil(total / limit), 1),
  },
});

module.exports = { escapeRegex, getPagination, paginatedResponse };
