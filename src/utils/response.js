const success = (body) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, data: body }),
  };
};

const badRequest = (error = "An error occurred") => {
  return {
    statusCode: 400,
    body: JSON.stringify({
      success: false,
      error,
    }),
  };
};

const created = (body = {}) => {
  return {
    statusCode: 201,
    body: JSON.stringify({ success: true, data: body }),
  };
};

const noContent = (statusCode = 204) => {
  return {
    statusCode,
  };
};

const notFound = (message = "Not Found") => {
  return {
    statusCode: 404,
    body: JSON.stringify({ success: false, error: message }),
  };
};

const serverError = (error = "Internal Server Error") => {
  return {
    statusCode: 500,
    body: JSON.stringify({ success: false, error }),
  };
};

module.exports = {
  success,
  badRequest,
  created,
  noContent,
  notFound,
  serverError,
};
