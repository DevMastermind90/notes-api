const { v4: uuidv4 } = require("uuid");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const Joi = require("joi");
const { docClient } = require("../db/dynamoClient");
const { created, badRequest } = require("../utils/response");
const { validateInput } = require("../utils/validator");
const logger = require("../utils/logger");

const schema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  content: Joi.string().min(1).max(1000).required(),
});

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    validateInput(body, schema);

    const note = {
      id: uuidv4(),
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.NOTES_TABLE,
        Item: note,
      })
    );

    logger.info("Note created successfully", { note });

    return created(note);
  } catch (error) {
    logger.error("Error creating note", error.message);
    return badRequest(error.message);
  }
};
