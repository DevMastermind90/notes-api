module.exports.validateInput = (data, schema) => {
  if (!data) throw new Error(`Validation Error: missing input data!`);
  const { error } = schema.validate(data);
  if (error) throw new Error(`Validation Error: ${error.details[0].message}`);
};
