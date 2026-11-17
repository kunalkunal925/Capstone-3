const Cart = require('../models/Cart');
const Product = require('../models/Product');
const httpError = require('../utils/httpError');

const parseQuantity = (quantity) => {
  const parsed = Number(quantity);
  if (!Number.isInteger(parsed) || parsed < 1) throw httpError(400, 'Quantity must be a positive whole number');
  return parsed;
};

const getPopulatedCart = async (cart) => {
  await cart.populate('items.product');
  const availableItems = cart.items.filter((item) => item.product);
  if (availableItems.length !== cart.items.length) {
    cart.items = availableItems;
    await cart.save();
  }
  return cart;
};

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(await getPopulatedCart(cart));
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const normalizedQuantity = parseQuantity(quantity);
    const product = await Product.findById(productId);
    if (!product) throw httpError(404, 'Product not found');
    if (product.stock < normalizedQuantity) throw httpError(409, 'Product unavailable or insufficient stock');

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + normalizedQuantity;
      if (newQuantity > product.stock) throw httpError(409, 'Requested quantity exceeds available stock');
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity: normalizedQuantity });
    }

    await cart.save();
    const populatedCart = await getPopulatedCart(cart);
    res.json(populatedCart);
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const quantity = parseQuantity(req.body.quantity);
    const product = await Product.findById(req.params.productId);
    if (!product) throw httpError(404, 'Product not found');
    if (quantity > product.stock) throw httpError(409, 'Requested quantity exceeds available stock');

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw httpError(404, 'Cart not found');
    const item = cart.items.find((entry) => entry.product.toString() === req.params.productId);
    if (!item) throw httpError(404, 'Product is not in your cart');

    item.quantity = quantity;
    await cart.save();
    res.json(await getPopulatedCart(cart));
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      throw httpError(404, 'Cart not found');
    }
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(await cart.populate('items.product'));
  } catch (err) {
    next(err);
  }
};