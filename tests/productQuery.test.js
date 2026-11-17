const test = require('node:test');
const assert = require('node:assert/strict');
const { buildProductQuery } = require('../utils/productQuery');

test('builds safe product filters, sort and pagination from valid query params', () => {
  const query = buildProductQuery({
    search: 'mug (large)',
    category: 'Home',
    minPrice: '50',
    maxPrice: '900',
    sort: 'price-asc',
    page: '2',
    limit: '6',
  });

  assert.deepEqual(query.filter, {
    name: { $regex: 'mug \\(large\\)', $options: 'i' },
    category: 'Home',
    price: { $gte: 50, $lte: 900 },
  });
  assert.deepEqual(query.sort, { price: 1, _id: 1 });
  assert.equal(query.page, 2);
  assert.equal(query.limit, 6);
  assert.equal(query.skip, 6);
});

test('rejects unsupported sort keys instead of passing client input to MongoDB', () => {
  assert.throws(() => buildProductQuery({ sort: 'price;dropDatabase' }), {
    statusCode: 400,
    message: 'Unsupported sort option',
  });
});

test('rejects invalid pagination and contradictory price ranges', () => {
  assert.throws(() => buildProductQuery({ page: '0' }), { statusCode: 400 });
  assert.throws(() => buildProductQuery({ minPrice: '90', maxPrice: '10' }), {
    statusCode: 400,
    message: 'Minimum price cannot exceed maximum price',
  });
});
