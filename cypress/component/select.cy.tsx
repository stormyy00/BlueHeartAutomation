import Select from "@/components/global/select";

describe("Select", () => {
  const options = ["Option A", "Option B", "Option C"].map((item) => ({
    label: item,
    value: item,
  }));
  const placeholder = "Select an option";
  it("Renders", () => {
    const Parent = () => {
      return <Select options={options} placeholder={placeholder} />;
    };

    cy.mount(<Parent />);

    cy.get('[data-cy="select-toggle"]').should("exist");
    cy.get('[data-cy="select-menu"]').should("not.exist");
  });

  it("Show Dropdown", () => {
    const Parent = () => {
      return <Select options={options} placeholder={placeholder} />;
    };

    cy.mount(<Parent />);

    cy.get('[data-cy="select-toggle"]').click();
    cy.get('[data-cy="select-menu"]').should("be.visible");
  });
  it("Selects and Updates", () => {
    const Parent = () => {
      return <Select options={options} placeholder={placeholder} />;
    };

    cy.mount(<Parent />);

    cy.get('[data-cy="select-toggle"]').click();

    const selectedOption = options[0].value;
    cy.get('[data-cy="select-menu"]').contains(selectedOption).click();

    cy.get('[data-cy="select-toggle"]').should("contain", selectedOption);

    cy.get('[data-cy="select-toggle"]').then(($toggle) => {
      const updatedUserName = $toggle.text().trim();
      expect(updatedUserName).to.equal(selectedOption);
    });
  });
});
