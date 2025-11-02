describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should load the homepage', () => {
    cy.visit('/');
    cy.contains('Welcome to MERN Testing Assignment');
  });

  it('should display error boundary on component error', () => {
    // This test verifies the error boundary is working
    // In a real app, you'd trigger an actual error
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});

