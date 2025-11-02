const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes (require authentication)
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;

