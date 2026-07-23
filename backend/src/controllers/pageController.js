const Page = require('../models/Page');

exports.createPage = async (req, res) => {
  try {
    const { title, slug, description, blocks, seoTitle, seoDescription, seoKeywords } = req.body;

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Title and slug are required',
      });
    }

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists',
      });
    }

    const page = await Page.create({
      title,
      slug,
      description,
      blocks: blocks || [],
      seoTitle,
      seoDescription,
      seoKeywords,
      createdBy: req.admin.id,
    });

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, blocks, status, seoTitle, seoDescription, seoKeywords } = req.body;

    let page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    // Check if slug is being changed and if new slug exists
    if (slug && slug !== page.slug) {
      const existingPage = await Page.findOne({ slug });
      if (existingPage) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists',
        });
      }
    }

    // Update fields
    if (title) page.title = title;
    if (slug) page.slug = slug;
    if (description !== undefined) page.description = description;
    if (blocks) page.blocks = blocks;
    if (status) page.status = status;
    if (seoTitle) page.seoTitle = seoTitle;
    if (seoDescription) page.seoDescription = seoDescription;
    if (seoKeywords) page.seoKeywords = seoKeywords;

    page.updatedBy = req.admin.id;

    // Update publishedAt and publishedBy if status changes to published
    if (status === 'published' && page.status !== 'published') {
      page.publishedAt = new Date();
      page.publishedBy = req.admin.id;
    }

    page = await page.save();

    res.status(200).json({
      success: true,
      message: 'Page updated successfully',
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Page.findById(id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .populate('publishedBy', 'username email');

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOne({ slug, status: 'published' });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.listPages = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const pages = await Page.find(query)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Page.countDocuments(query);

    res.status(200).json({
      success: true,
      pages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Page.findByIdAndDelete(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.publishPage = async (req, res) => {
  try {
    const { id } = req.params;

    let page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    page.status = 'published';
    page.publishedAt = new Date();
    page.publishedBy = req.admin.id;
    page.updatedBy = req.admin.id;

    page = await page.save();

    res.status(200).json({
      success: true,
      message: 'Page published successfully',
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unpublishPage = async (req, res) => {
  try {
    const { id } = req.params;

    let page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
      });
    }

    page.status = 'draft';
    page.updatedBy = req.admin.id;

    page = await page.save();

    res.status(200).json({
      success: true,
      message: 'Page unpublished successfully',
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
