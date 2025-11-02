import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostCard from '../../components/PostCard';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('PostCard Integration Tests', () => {
  const mockPost = {
    _id: '1',
    title: 'Test Post',
    content: 'This is a test post content',
    author: {
      username: 'testuser',
      email: 'test@example.com'
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    views: 10,
    published: true,
    tags: ['react', 'testing']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onEdit handler when edit button is clicked', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <PostCard 
        post={mockPost}
        showActions={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockPost);
  });

  it('calls onDelete handler when delete button is clicked', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <PostCard 
        post={mockPost}
        showActions={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockPost._id);
  });

  it('renders all post information correctly in a complete flow', () => {
    render(<PostCard post={mockPost} showActions={true} />);

    // Verify all elements are present
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockPost.author.username, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/10 views/i)).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    
    // Verify tags
    mockPost.tags.forEach(tag => {
      expect(screen.getByText(new RegExp(tag, 'i'))).toBeInTheDocument();
    });
  });
});

