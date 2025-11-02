// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/users/login',
    body: {
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    window.localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('register', (username, email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/users/register',
    body: {
      username,
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

