const { handler: getNote } = require("../../src/functions/getNote");
const { docClient } = require("../../src/db/dynamoClient");

jest.mock("../../src/db/dynamoClient", () => ({
  docClient: {
    send: jest.fn(),
  },
}));

describe("getNote Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully retrieve a note by ID", async () => {
    const mockNote = {
      id: "123",
      title: "Test Note",
      content: "Test Content",
    };

    docClient.send.mockResolvedValueOnce({
      Item: mockNote,
    });

    const event = {
      pathParameters: {
        id: "123",
      },
    };

    const result = await getNote(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      success: true,
      data: mockNote,
    });

    expect(docClient.send).toHaveBeenCalledWith(
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

    const result = await getNote(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "Note with ID non-existent-id not found",
    });
  });

  it("should return 400 when note ID is missing", async () => {
    const event = {
      pathParameters: {},
    };

    const result = await getNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "Note ID is required",
    });
  });

  it("should handle DynamoDB errors gracefully", async () => {
    const mockError = new Error("DynamoDB error");
    docClient.send.mockRejectedValueOnce(mockError);

    const event = {
      pathParameters: {
        id: "123",
      },
    };

    const result = await getNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "Could not fetch the note",
    });
  });
});
