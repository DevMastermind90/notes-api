const { validateInput } = require("../../src/utils/validator");
const Joi = require("joi");

describe("Validator Utility", () => {
  const testSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });

  it("should throw error when data is missing", () => {
    expect(() => validateInput(null, testSchema)).toThrow(
      "Validation Error: missing input data!"
    );
    expect(() => validateInput(undefined, testSchema)).toThrow(
      "Validation Error: missing input data!"
    );
  });

  it("should throw error when validation fails", () => {
    const invalidData = { title: "Test" };
    expect(() => validateInput(invalidData, testSchema)).toThrow(
      'Validation Error: "content" is required'
    );
  });

  it("should not throw error when validation passes", () => {
    const validData = { title: "Test", content: "Content" };
    expect(() => validateInput(validData, testSchema)).not.toThrow();
  });
});
