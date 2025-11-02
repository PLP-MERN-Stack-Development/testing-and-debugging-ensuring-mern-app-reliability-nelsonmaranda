const Post = require('../models/Post');
const { asyncHandler } = require('../middleware/errorHandler');
const { validatePagination, isValidObjectId } = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Create a new post
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, published } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({
      error: 'Title and content are required'
    });
  }

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Create post
  const post = await Post.create({
    title,
    content,
    author: req.user._id,
    category: category || undefined,
    tags: tags || [],
    published: published || false,
    slug: `${slug}-${Date.now()}`
  });

  await post.populate('author', 'username email');

  logger.info(`New post created: ${post.title} by ${req.user.username}`);

  res.status(201).json({
    message: 'Post created successfully',
    post
  });
});

/**
 * Get all posts with pagination and filtering
 */
const getAllPosts = asyncHandler(async (req, res) => {
  const { page, limit, category, published, search } = req.query;
  
  // Validate pagination
  const { skip, limit: limitNum } = validatePagination(page, limit);

  // Build query
  const query = {};
  
  if (category && isValidObjectId(category)) {
    query.category = category;
  }
  
  if (published !== undefined) {
    query.published = published === 'true';
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  // Get posts
  const posts = await Post.find(query)
    .populate('author', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Post.countDocuments(query);

  res.json({
    count: posts.length,
    total,
    page: parseInt(page) || 1,
    limit: limitNum,
    posts
  });
});

/**
 * Get single post by ID
 */
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  const post = await Post.findById(id)
    .populate('author', 'username email');

  if (!post) {
    return res.status(404).json({
      error: 'Post not found'
    });
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json({
    post
  });
});

/**
 * Update a post
 */
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags, published } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  // Find post
  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({
      error: 'Post not found'
    });
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. You can only update your own posts.'
    });
  }

  // Update fields
  if (title) post.title = title;
  if (content) post.content = content;
  if (category !== undefined) post.category = category;
  if (tags) post.tags = tags;
  if (published !== undefined) post.published = published;

  await post.save();
  await post.populate('author', 'username email');

  logger.info(`Post updated: ${post.title} by ${req.user.username}`);

  res.json({
    message: 'Post updated successfully',
    post
  });
});

/**
 * Delete a post
 */
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  // Find post
  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({
      error: 'Post not found'
    });
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. You can only delete your own posts.'
    });
  }

  await Post.findByIdAndDelete(id);

  logger.info(`Post deleted: ${post.title} by ${req.user.username}`);

  res.json({
    message: 'Post deleted successfully'
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};

