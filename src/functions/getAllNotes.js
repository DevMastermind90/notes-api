const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../db/dynamoClient");
const { success, badRequest } = require("../utils/response");
const logger = require("../utils/logger");

module.exports.handler = async () => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    logger.info("All notes retrieved", { count: result.Items.length });

    return success(result.Items);
  } catch (error) {
    logger.error("Error retrieving notes", error);
    return badRequest(error.message);
  }
};
