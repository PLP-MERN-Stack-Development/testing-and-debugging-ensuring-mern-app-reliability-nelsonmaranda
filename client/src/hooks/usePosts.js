import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook for managing posts
 */
const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  /**
   * Fetch all posts
   */
  const fetchPosts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...(params.category && { category: params.category }),
        ...(params.published !== undefined && { published: params.published }),
        ...(params.search && { search: params.search })
      });

      const response = await axios.get(`${API_URL}/posts?${queryParams}`);
      
      setPosts(response.data.posts || []);
      setPagination({
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total: response.data.total || 0
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch single post by ID
   */
  const fetchPost = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      return response.data.post;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new post
   */
  const createPost = async (postData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      await fetchPosts();
      return response.data.post;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a post
   */
  const updatePost = async (id, postData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(
        `${API_URL}/posts/${id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      await fetchPosts();
      return response.data.post;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a post
   */
  const deletePost = async (id, token) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(
        `${API_URL}/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      await fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost
  };
};

export default usePosts;

