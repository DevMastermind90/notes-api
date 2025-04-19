const { handler: updateNote } = require("../../src/functions/updateNote");
const { docClient } = require("../../src/db/dynamoClient");

jest.mock("../../src/db/dynamoClient", () => ({
  docClient: {
    send: jest.fn(),
  },
}));

describe("updateNote Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update a note", async () => {
    docClient.send.mockResolvedValueOnce({
      Item: {
        id: "123",
        title: "Old Title",
        content: "Old Content",
      },
    });

    docClient.send.mockResolvedValueOnce({
      Attributes: {
        id: "123",
        title: "New Title",
        content: "New Content",
        updatedAt: "2024-03-20T12:00:00.000Z",
      },
    });

    const event = {
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        title: "New Title",
        content: "New Content",
      }),
    };

    const result = await updateNote(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      success: true,
      data: {
        id: "123",
        title: "New Title",
        content: "New Content",
        updatedAt: "2024-03-20T12:00:00.000Z",
      },
    });

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
          UpdateExpression: expect.any(String),
          ExpressionAttributeValues: expect.objectContaining({
            ":title": "New Title",
            ":content": "New Content",
            ":updatedAt": expect.any(String),
          }),
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
      body: JSON.stringify({
        title: "New Title",
        content: "New Content",
      }),
    };

    const result = await updateNote(event);

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
      body: JSON.stringify({
        title: "New Title",
        content: "New Content",
      }),
    };

    const result = await updateNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "Note ID is required",
    });

    expect(docClient.send).not.toHaveBeenCalled();
  });

  it("should return 400 when title is missing", async () => {
    const event = {
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        content: "New Content",
      }),
    };

    const result = await updateNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("title"),
    });
  });

  it("should return 400 when content is missing", async () => {
    const event = {
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        title: "New Title",
      }),
    };

    const result = await updateNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("content"),
    });
  });

  it("should return 400 when title is too long", async () => {
    const event = {
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        title: "a".repeat(101),
        content: "New Content",
      }),
    };

    const result = await updateNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("title"),
    });
  });

  it("should return 400 when content is too long", async () => {
    const event = {
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        title: "New Title",
        content: "a".repeat(1001),
      }),
    };

    const result = await updateNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("content"),
    });
  });

  it("should handle DynamoDB errors gracefully", async () => {
    docClient.send.mockResolvedValueOnce({
      Item: {
        id: "123",
        title: "Old Title",
        content: "Old Content",
      },
    });

    const mockError = new Error("DynamoDB error");
    docClient.send.mockRejectedValueOnce(mockError);

    const event = {
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        title: "New Title",
        content: "New Content",
      }),
    };

    const result = await updateNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "DynamoDB error",
    });
  });
});
