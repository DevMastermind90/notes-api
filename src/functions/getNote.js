const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../db/dynamoClient");
const { success, badRequest, notFound } = require("../utils/response");
const logger = require("../utils/logger");

module.exports.handler = async (event) => {
  const noteId = event.pathParameters.id;

  if (!noteId) {
    logger.error("Missing note ID in path parameters");
    return badRequest("Note ID is required");
  }

  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: process.env.NOTES_TABLE,
        Key: { id: noteId },
      })
    );

    if (!result.Item) {
      logger.info("Note not found", { id: noteId });
      return notFound(`Note with ID ${noteId} not found`);
    }

    logger.info("Note retrieved", { note: result.Item });

    return success(result.Item);
  } catch (error) {
    logger.error("Error retrieving note", { error });
    return badRequest("Could not fetch the note");
  }
};
