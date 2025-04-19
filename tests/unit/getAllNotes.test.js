const { handler: getAllNotes } = require("../../src/functions/getAllNotes");
const { docClient } = require("../../src/db/dynamoClient");

jest.mock("../../src/db/dynamoClient", () => ({
  docClient: {
    send: jest.fn(),
  },
}));

describe("getAllNotes Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully retrieve all notes", async () => {
    const mockItems = [
      { id: "1", title: "Note 1", content: "Content 1" },
      { id: "2", title: "Note 2", content: "Content 2" },
    ];

    docClient.send.mockResolvedValueOnce({
      Items: mockItems,
    });

    const result = await getAllNotes();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      success: true,
      data: mockItems,
    });

    expect(docClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: process.env.NOTES_TABLE,
        }),
      })
    );
  });

  it("should handle DynamoDB errors gracefully", async () => {
    const mockError = new Error("DynamoDB error");
    docClient.send.mockRejectedValueOnce(mockError);

    const result = await getAllNotes();

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: "DynamoDB error",
    });
  });
});
