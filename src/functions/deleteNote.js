const { DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../db/dynamoClient");
const { noContent, badRequest, notFound } = require("../utils/response");
const logger = require("../utils/logger");

module.exports.handler = async (event) => {
  const noteId = event.pathParameters?.id;

  if (!noteId) {
    logger.error("Missing note ID in path parameters");
    return badRequest("Note ID is required");
  }

  try {
    const existingNote = await docClient.send(
      new GetCommand({
        TableName: process.env.NOTES_TABLE,
        Key: { id: noteId },
      })
    );

    if (!existingNote.Item) {
      logger.info("Note not found", { id: noteId });
      return notFound(`Note with ID ${noteId} not found`);
    }

    await docClient.send(
      new DeleteCommand({
        TableName: process.env.NOTES_TABLE,
        Key: { id: noteId },
      })
    );

    logger.info("Note deleted successfully", { id: noteId });
    return noContent();
  } catch (error) {
    logger.error("Error deleting note", { id: noteId, error });
    return badRequest("Could not delete the note");
  }
};
