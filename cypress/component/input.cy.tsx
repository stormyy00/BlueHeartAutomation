import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("Placeholder", () => {
    const Parent = () => {
      return (
        <Input name="first" type="text" title="First Name" placeholder="John" />
      );
    };

    cy.mount(<Parent />);
    cy.get('[data-cy="first-input"]').should(
      "have.attr",
      "placeholder",
      "John",
    );
  });

  it("Typing...", () => {
    const Parent = () => {
      return (
        <Input
          name="first"
          type="text"
          title="First Name"
          placeholder=""
          maxLength={50}
        />
      );
    };

    cy.mount(<Parent />);
    cy.get('[data-cy="first-input"]').should("have.value", "");
    cy.get('[data-cy="first-input"]').type("John Doe");
    cy.get('[data-cy="first-input"]').should("have.value", "John Doe");
  });

  it("Backspace", () => {
    const Parent = () => {
      return (
        <Input
          name="first"
          type="text"
          title="First Name"
          placeholder=""
          maxLength={50}
        />
      );
    };

    cy.mount(<Parent />);
    cy.get('[data-cy="first-input"]').should("have.value", "");
    cy.get('[data-cy="first-input"]').type("John Doe");
    cy.get('[data-cy="first-input"]').type("{backspace}");
    cy.get('[data-cy="first-input"]').should("have.value", "John Do");
  });

  it("Select all clear", () => {
    const Parent = () => {
      return (
        <Input
          name="first"
          type="text"
          title="First Name"
          placeholder=""
          maxLength={50}
        />
      );
    };

    cy.mount(<Parent />);
    cy.get('[data-cy="first-input"]').should("have.value", "");
    cy.get('[data-cy="first-input"]').type("John Doe");
    cy.get('[data-cy="first-input"]').clear();
    cy.get('[data-cy="first-input"]').should("be.empty");
  });
});
