const Product = require('../models/Product');
const httpError = require('../utils/httpError');
const { buildProductQuery } = require('../utils/productQuery');

const PRODUCT_FIELDS = [
  'name',
  'description',
  'imageUrl',
  'price',
  'compareAtPrice',
  'features',
  'boxContents',
  'stock',
  'category',
];

const pickProductFields = (body) => {
  const fields = Object.fromEntries(
    PRODUCT_FIELDS.filter((field) => body?.[field] !== undefined).map((field) => [field, body[field]])
  );
  for (const field of ['features', 'boxContents']) {
    if (typeof fields[field] === 'string') {
      fields[field] = fields[field].split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    }
  }
  return fields;
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(pickProductFields(req.body));
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { filter, sort, page, limit, skip } = buildProductQuery(req.query);
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sort).skip(skip).limit(limit),
    ]);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const fields = pickProductFields(req.body);
    if (Object.keys(fields).length === 0) throw httpError(400, 'Provide at least one product field to update');
    const product = await Product.findByIdAndUpdate(req.params.id, fields, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw httpError(404, 'Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};