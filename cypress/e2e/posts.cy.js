describe('Posts API E2E Tests', () => {
  const API_URL = 'http://localhost:5000/api';
  let authToken;
  let userId;

  before(() => {
    // Register a test user and get token
    cy.request({
      method: 'POST',
      url: `${API_URL}/users/register`,
      body: {
        username: 'e2etestuser',
        email: 'e2etest@example.com',
        password: 'password123'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      authToken = response.body.token;
      userId = response.body.user.id;
    });
  });

  it('should create a new post when authenticated', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/posts`,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: {
        title: 'E2E Test Post',
        content: 'This is a test post created during E2E testing',
        published: false
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.post).to.have.property('title', 'E2E Test Post');
      expect(response.body.post).to.have.property('content');
    });
  });

  it('should return 401 when creating post without authentication', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/posts`,
      body: {
        title: 'Unauthorized Post',
        content: 'This should fail'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('should get all posts', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}/posts`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('posts');
      expect(response.body.posts).to.be.an('array');
    });
  });

  it('should get a single post by ID', () => {
    // First create a post
    cy.request({
      method: 'POST',
      url: `${API_URL}/posts`,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: {
        title: 'Single Post Test',
        content: 'Content for single post test',
        published: true
      }
    }).then((createResponse) => {
      const postId = createResponse.body.post._id;

      // Then fetch it
      cy.request({
        method: 'GET',
        url: `${API_URL}/posts/${postId}`
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.post._id).to.eq(postId);
        expect(getResponse.body.post.title).to.eq('Single Post Test');
      });
    });
  });

  it('should update a post when authenticated as author', () => {
    // Create a post first
    cy.request({
      method: 'POST',
      url: `${API_URL}/posts`,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: {
        title: 'Post to Update',
        content: 'Original content',
        published: false
      }
    }).then((createResponse) => {
      const postId = createResponse.body.post._id;

      // Update the post
      cy.request({
        method: 'PUT',
        url: `${API_URL}/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          title: 'Updated Post Title',
          content: 'Updated content'
        }
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.post.title).to.eq('Updated Post Title');
        expect(updateResponse.body.post.content).to.eq('Updated content');
      });
    });
  });

  it('should delete a post when authenticated as author', () => {
    // Create a post first
    cy.request({
      method: 'POST',
      url: `${API_URL}/posts`,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: {
        title: 'Post to Delete',
        content: 'This post will be deleted',
        published: false
      }
    }).then((createResponse) => {
      const postId = createResponse.body.post._id;

      // Delete the post
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body.message).to.include('deleted');

        // Verify post is deleted
        cy.request({
          method: 'GET',
          url: `${API_URL}/posts/${postId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(404);
        });
      });
    });
  });
});

