const {
  success,
  badRequest,
  created,
  noContent,
  notFound,
  serverError,
} = require("../../src/utils/response");

describe("Response Utility", () => {
  describe("success", () => {
    it("should return 200 status with body", () => {
      const body = { message: "Success" };
      const response = success(body);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        success: true,
        data: body,
      });
    });
  });

  describe("badRequest", () => {
    it("should return 400 status with default error", () => {
      const response = badRequest();
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toEqual({
        success: false,
        error: "An error occurred",
      });
    });

    it("should return 400 status with custom error", () => {
      const error = "Custom error message";
      const response = badRequest(error);
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toEqual({
        success: false,
        error,
      });
    });
  });

  describe("created", () => {
    it("should return 201 status with default body", () => {
      const response = created();
      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({
        success: true,
        data: {},
      });
    });

    it("should return 201 status with custom body", () => {
      const body = { id: "123" };
      const response = created(body);
      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({
        success: true,
        data: body,
      });
    });
  });

  describe("noContent", () => {
    it("should return 204 status by default", () => {
      const response = noContent();
      expect(response.statusCode).toBe(204);
      expect(response.body).toBeUndefined();
    });

    it("should return custom status code", () => {
      const statusCode = 205;
      const response = noContent(statusCode);
      expect(response.statusCode).toBe(statusCode);
      expect(response.body).toBeUndefined();
    });
  });

  describe("notFound", () => {
    it("should return 404 status with default message", () => {
      const response = notFound();
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        success: false,
        error: "Not Found",
      });
    });

    it("should return 404 status with custom message", () => {
      const message = "Resource not found";
      const response = notFound(message);
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        success: false,
        error: message,
      });
    });
  });

  describe("serverError", () => {
    it("should return 500 status with default error", () => {
      const response = serverError();
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toEqual({
        success: false,
        error: "Internal Server Error",
      });
    });

    it("should return 500 status with custom error", () => {
      const error = "Custom server error";
      const response = serverError(error);
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toEqual({
        success: false,
        error,
      });
    });
  });
});
