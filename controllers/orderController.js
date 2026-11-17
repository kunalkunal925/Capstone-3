const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const httpError = require('../utils/httpError');

exports.placeOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    let createdOrder;
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user._id }).session(session).populate('items.product');
      if (!cart || cart.items.length === 0) throw httpError(400, 'Your cart is empty');

      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart.items) {
        if (!item.product) throw httpError(409, 'A product in your cart is no longer available');
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );
        if (!updatedProduct) throw httpError(409, `${item.product.name} no longer has enough stock`);

        totalAmount += item.product.price * item.quantity;
        orderItems.push({
          product: item.product._id,
          name: item.product.name,
          priceSnapshot: item.product.price,
          categorySnapshot: item.product.category,
          quantity: item.quantity,
        });
      }

      const subtotal = totalAmount;
      const deliveryFee = 0;

      const [order] = await Order.create(
        [
          {
            user: req.user._id,
            items: orderItems,
            subtotal,
            deliveryFee,
            totalAmount,
            paymentMethod: 'COD',
            shippingAddress: req.body.shippingAddress,
          },
        ],
        { session }
      );
      cart.items = [];
      await cart.save({ session });
      createdOrder = order;
    });

    res.status(201).json(createdOrder);
  } catch (err) {
    next(err);
  } finally {
    await session.endSession();
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) throw httpError(404, 'Order not found');
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getSalesReport = async (req, res, next) => {
  try {
    const [categoryRevenue, topProducts, summary] = await Promise.all([
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: { $ifNull: ['$items.categorySnapshot', 'Other'] },
            totalRevenue: { $sum: { $multiply: ['$items.priceSnapshot', '$items.quantity'] } },
            unitsSold: { $sum: '$items.quantity' },
          },
        },
        { $sort: { totalRevenue: -1 } },
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.name',
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.priceSnapshot', '$items.quantity'] } },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    res.json({
      categoryRevenue,
      topProducts,
      totalOrders: summary[0]?.totalOrders || 0,
      totalRevenue: summary[0]?.totalRevenue || 0,
    });
  } catch (err) {
    next(err);
  }
};