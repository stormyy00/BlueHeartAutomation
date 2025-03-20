import React from "react";
import { Button } from "../../src/components/ui/button";

describe("<Button />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button />);
  });

  it("Renders with text", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button data-cy="first-button">Hello</Button>);

    cy.get('[data-cy="first-button"]').should("have.text", "Hello");
  });
});
