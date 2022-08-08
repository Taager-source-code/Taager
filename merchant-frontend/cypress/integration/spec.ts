describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Ø¥Ø¨Ø¯Ø£ Ø§Ù„Ø¢Ù†');
    cy.contains('Ø­Ù‚Ù‚ Ø­Ù„Ù…Ùƒ ÙˆØ§Ø¨Ø¯Ø£ ØªØ¬Ø§Ø±ØªÙƒ');
  });
});


