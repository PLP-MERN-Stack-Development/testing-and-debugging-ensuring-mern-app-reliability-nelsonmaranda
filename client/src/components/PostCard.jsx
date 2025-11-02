import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import './PostCard.css';

/**
 * PostCard component - Displays a single post in a card format
 */
const PostCard = ({ post, onEdit, onDelete, showActions = false }) => {
  if (!post) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="post-card" data-testid="post-card">
      <div className="post-card-header">
        <h3 className="post-card-title">{post.title}</h3>
        {post.published && <span className="post-badge published">Published</span>}
        {!post.published && <span className="post-badge draft">Draft</span>}
      </div>
      
      <div className="post-card-content">
        <p>{post.content}</p>
      </div>
      
      <div className="post-card-meta">
        {post.author && (
          <span className="post-author">
            By {typeof post.author === 'object' ? post.author.username : 'Unknown'}
          </span>
        )}
        {post.createdAt && (
          <span className="post-date">{formatDate(post.createdAt)}</span>
        )}
        {post.views !== undefined && (
          <span className="post-views">{post.views} views</span>
        )}
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="post-card-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="post-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      {showActions && (
        <div className="post-card-actions">
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(post)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(post._id)}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        username: PropTypes.string
      })
    ]),
    createdAt: PropTypes.string,
    views: PropTypes.number,
    published: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool
};

export default PostCard;

