const test = require('node:test');
const assert = require('node:assert/strict');
const Product = require('../models/Product');

test('product stock must be a non-negative whole number', async () => {
  const product = new Product({
    name: 'Test product',
    description: 'A product used to check catalogue validation.',
    price: 99,
    stock: 1.5,
    category: 'Boards',
  });

  test('product rejects invalid sale pricing and overlong feature details', async () => {
    const product = new Product({
      name: 'Test electronics board',
      description: 'A product used to check NeevCraft catalogue validation.',
      price: 99,
      compareAtPrice: -1,
      features: ['x'.repeat(181)],
      stock: 1,
      category: 'Boards',
    });

    await assert.rejects(product.validate(), (error) => {
      assert.ok(error.errors.compareAtPrice);
      assert.ok(error.errors['features.0']);
      return true;
    });
  });

  await assert.rejects(product.validate(), (error) => {
    assert.equal(error.errors.stock.message, 'Stock must be a whole number');
    return true;
  });
});
