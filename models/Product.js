const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    features: [{ type: String, trim: true, maxlength: 180 }],
    boxContents: [{ type: String, trim: true, maxlength: 180 }],
    stock: {
      type: Number,
      required: true,
      min: 0,
      validate: { validator: Number.isInteger, message: 'Stock must be a whole number' },
    },
    category: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { timestamps: true }
);

// Index for fast search & category filtering
productSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);