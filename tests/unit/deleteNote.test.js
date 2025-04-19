const { handler: deleteNote } = require("../../src/functions/deleteNote");
const { docClient } = require("../../src/db/dynamoClient");

jest.mock("../../src/db/dynamoClient", () => ({
  docClient: {
    send: jest.fn(),
  },
}));

describe("deleteNote Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete a note", async () => {
    docClient.send.mockResolvedValueOnce({
      Item: {
        id: "123",
        title: "Test Note",
        content: "Test Content",
      },
    });

    docClient.send.mockResolvedValueOnce({});

    const event = {
      pathParameters: {
        id: "123",
      },
    };

    const result = await deleteNote(event);

    expect(result.statusCode).toBe(204);

    expect(docClient.send).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: process.env.NOTES_TABLE,
          Key: { id: "123" },
        }),
      })
    );

    expect(docClient.send).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: process.env.NOTES_TABLE,
          Key: { id: "123" },
        }),
      })
    );
  });

  it("should return 404 when note is not found", async () => {
    docClient.send.mockResolvedValueOnce({
      Item: null,
    });

    const event = {
      pathParameters: {
        id: "non-existent-id",
      },
    };

    const result = await deleteNote(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "Note with ID non-existent-id not found",
    });

    expect(docClient.send).toHaveBeenCalledTimes(1);
  });

  it("should return 400 when note ID is missing", async () => {
    const event = {
      pathParameters: {},
    };

    const result = await deleteNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "Note ID is required",
    });

    expect(docClient.send).not.toHaveBeenCalled();
  });

  it("should handle DynamoDB errors gracefully", async () => {
    docClient.send.mockResolvedValueOnce({
      Item: {
        id: "123",
        title: "Test Note",
        content: "Test Content",
      },
    });

    const mockError = new Error("DynamoDB error");
    docClient.send.mockRejectedValueOnce(mockError);

    const event = {
      pathParameters: {
        id: "123",
      },
    };

    const result = await deleteNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "Could not delete the note",
    });
  });
});
