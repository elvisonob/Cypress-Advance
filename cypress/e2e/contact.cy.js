/// <reference types="Cypress" />

describe('contact form', () => {
  beforeEach(() => {
    cy.visit('/about');
  });
  it('should submit the form', () => {
    cy.task('seedDatabase');
    cy.getById('contact-input-message').type('Hello world!');
    cy.getById('contact-input-name').type('John Doe');
    cy.getById('contact-btn-submit').then((el) => {
      expect(el.attr('disabled')).to.be.undefined;
      expect(el.text()).to.eq('Send Message');
    });
    cy.screenshot();
    cy.get('[data-cy="contact-input-email"]').type('test@example.com');
    cy.submitForm();
    // cy.get('[data-cy="contact-btn-submit"]')
    //   .contains('Send Message')
    //   .and('not.have.attr', 'disabled');
    cy.screenshot();
    cy.get('[data-cy="contact-btn-submit"]').as('submitBtn');
    // cy.get('@submitBtn').click();
    cy.get('@submitBtn').contains('Sending...');
    cy.get('@submitBtn').should('have.attr', 'disabled');
  });

  it('should validate the form input', () => {
    cy.submitForm();
    cy.get('[data-cy="contact-btn-submit"]').then((el) => {
      expect(el).to.not.have.attr('disabled');
      expect(el.text()).to.not.equal('Sending...');
    });
    cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');
    cy.get('[data-cy="contact-input-message"]').as('msgInput');
    cy.get('@msgInput').focus().blur();
    cy.get('@msgInput')
      .parent()
      .should('have.attr', 'class')
      .and('match', /invalid/);

    cy.get('[data-cy="contact-input-name"]').as('nameInput');
    cy.get('@nameInput').focus().blur();
    cy.get('@nameInput')
      .parent()
      .should('have.attr', 'class')
      .and('match', /invalid/);

    cy.get('[data-cy="contact-input-email"]').as('emailInput');
    cy.get('@emailInput').focus().blur();
    cy.get('@emailInput')
      .parent()
      .should((el) => {
        expect(el.attr('class')).not.to.be.undefined;
        expect(el.attr('class')).contains('invalid');
      });
  });
});
