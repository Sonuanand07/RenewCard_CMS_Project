const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['header', 'paragraph', 'list', 'table', 'equation', 'richtext', 'image', 'cta'],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
});

const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    blocks: [BlockSchema],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    publishedAt: Date,
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

// Index for faster queries
PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1 });
PageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Page', PageSchema);
