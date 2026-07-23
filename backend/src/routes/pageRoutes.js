const express = require('express');
const router = express.Router();
const {
  createPage,
  updatePage,
  getPage,
  getPageBySlug,
  listPages,
  deletePage,
  publishPage,
  unpublishPage,
} = require('../controllers/pageController');
const { protectRoute, authorizeRole } = require('../middleware/authMiddleware');

// Public routes
router.get('/public/:slug', getPageBySlug);

// Protected routes
router.use(protectRoute);

router.post('/', authorizeRole('admin', 'editor'), createPage);
router.get('/', listPages);
router.get('/:id', getPage);
router.put('/:id', authorizeRole('admin', 'editor'), updatePage);
router.delete('/:id', authorizeRole('admin'), deletePage);
router.post('/:id/publish', authorizeRole('admin', 'editor'), publishPage);
router.post('/:id/unpublish', authorizeRole('admin', 'editor'), unpublishPage);

module.exports = router;
