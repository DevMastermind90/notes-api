const { GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const Joi = require("joi");
const { docClient } = require("../db/dynamoClient");
const { success, notFound, badRequest } = require("../utils/response");
const { validateInput } = require("../utils/validator");
const logger = require("../utils/logger");

const schema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  content: Joi.string().min(1).max(1000).required(),
});

module.exports.handler = async (event) => {
  const noteId = event.pathParameters.id;

  if (!noteId) {
    logger.error("Missing note ID in path parameters");
    return badRequest("Note ID is required");
  }

  try {
    const body = JSON.parse(event.body);
    validateInput(body, schema);

    const getResult = await docClient.send(
      new GetCommand({
        TableName: process.env.NOTES_TABLE,
        Key: { id: noteId },
      })
    );

    if (!getResult.Item) {
      logger.info("Note not found", { id: noteId });
      return notFound(`Note with ID ${noteId} not found`);
    }

    logger.info("Note retrieved", { note: getResult.Item });

    const result = await docClient.send(
      new UpdateCommand({
        TableName: process.env.NOTES_TABLE,
        Key: { id: noteId },
        UpdateExpression:
          "set title = :title, content = :content, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":title": body.title,
          ":content": body.content,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    logger.info("Note updated successfully", { note: result.Attributes });

    return success(result.Attributes);
  } catch (error) {
    logger.error("Error updating note", error);
    return badRequest(error.message);
  }
};
