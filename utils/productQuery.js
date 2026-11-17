const httpError = require('./httpError');

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1, _id: 1 },
  'price-desc': { price: -1, _id: 1 },
  'name-asc': { name: 1, _id: 1 },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseBoundedInteger = (value, label, fallback, maximum) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw httpError(400, `${label} must be an integer between 1 and ${maximum}`);
  }
  return parsed;
};

const buildProductQuery = (params) => {
  const search = typeof params.search === 'string' ? params.search.trim() : '';
  const category = typeof params.category === 'string' ? params.category.trim() : '';
  if (params.search !== undefined && typeof params.search !== 'string') {
    throw httpError(400, 'Search must be a single text value');
  }
  if (search.length > 100) throw httpError(400, 'Search must be 100 characters or fewer');
  if (params.category !== undefined && typeof params.category !== 'string') {
    throw httpError(400, 'Category must be a single text value');
  }

  const filter = {};
  if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };
  if (category) filter.category = category;

  const minPrice = params.minPrice === undefined ? undefined : Number(params.minPrice);
  const maxPrice = params.maxPrice === undefined ? undefined : Number(params.maxPrice);
  if (
    (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) ||
    (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))
  ) {
    throw httpError(400, 'Price filters must be non-negative numbers');
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw httpError(400, 'Minimum price cannot exceed maximum price');
    }
  }

  if (params.sort !== undefined && typeof params.sort !== 'string') {
    throw httpError(400, 'Sort must be a single value');
  }
  const sortKey = params.sort || 'newest';
  if (!Object.hasOwn(SORT_OPTIONS, sortKey)) {
    throw httpError(400, 'Unsupported sort option');
  }

  const page = parseBoundedInteger(params.page, 'Page', 1, 1000000);
  const limit = parseBoundedInteger(params.limit, 'Limit', 12, 100);

  return {
    filter,
    sort: SORT_OPTIONS[sortKey],
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

module.exports = { buildProductQuery, SORT_OPTIONS };
