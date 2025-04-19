const { handler: createNote } = require("../../src/functions/createNote");
const { docClient } = require("../../src/db/dynamoClient");

jest.mock("../../src/db/dynamoClient", () => ({
  docClient: {
    send: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-uuid"),
}));

describe("createNote Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create a note", async () => {
    const mockNote = {
      title: "Test Note",
      content: "Test Content",
    };

    const event = {
      body: JSON.stringify(mockNote),
    };

    docClient.send.mockResolvedValueOnce({});

    const result = await createNote(event);

    expect(result.statusCode).toBe(201);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toEqual({
      id: "test-uuid",
      title: "Test Note",
      content: "Test Content",
      createdAt: expect.any(String),
    });

    expect(docClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: process.env.NOTES_TABLE,
          Item: expect.objectContaining({
            id: "test-uuid",
            title: "Test Note",
            content: "Test Content",
            createdAt: expect.any(String),
          }),
        }),
      })
    );
  });

  it("should return 400 when title is missing", async () => {
    const invalidNote = {
      content: "Test Content",
    };

    const event = {
      body: JSON.stringify(invalidNote),
    };

    const result = await createNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("title"),
    });
  });

  it("should return 400 when content is missing", async () => {
    const invalidNote = {
      title: "Test Note",
    };

    const event = {
      body: JSON.stringify(invalidNote),
    };

    const result = await createNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("content"),
    });
  });

  it("should return 400 when title is too long", async () => {
    const invalidNote = {
      title: "a".repeat(101),
      content: "Test Content",
    };

    const event = {
      body: JSON.stringify(invalidNote),
    };

    const result = await createNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("title"),
    });
  });

  it("should return 400 when content is too long", async () => {
    const invalidNote = {
      title: "Test Note",
      content: "a".repeat(1001),
    };

    const event = {
      body: JSON.stringify(invalidNote),
    };

    const result = await createNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: expect.stringContaining("content"),
    });
  });

  it("should handle DynamoDB errors gracefully", async () => {
    const mockNote = {
      title: "Test Note",
      content: "Test Content",
    };

    const event = {
      body: JSON.stringify(mockNote),
    };

    const mockError = new Error("DynamoDB error");
    docClient.send.mockRejectedValueOnce(mockError);

    const result = await createNote(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "DynamoDB error",
    });
  });
});
