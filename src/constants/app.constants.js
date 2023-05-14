const STATUS_ERROR = "error";
const STATUS_SUCCESS = "success";

const ERR_USER_EXISTS = "User already exists";
const ERR_USER_NOT_FOUND = "User not found";
const ERR_INVALID_PASSWORD = "Invalid password";
const ERR_VALIDATION = "Validation error";
const ERR_SERVER_ERROR = "Internal server error";
const ERR_TOKEN_VERIFICATION = "Cannot verify your token";
const ERR_MISSING_AUTH_HEADER = "Auth header not found";
const ERR_SERVER_START = "Cannot start the server\n";
const ERR_REQUEST_LIMIT_EXCEEDED = "Number of requests exceeded.";

const MSG_SUCCESSFUL_REGISTRATION = "User registered successfully";
const MSG_SUCCESSFUL_LOGIN = "Login successful";
const MSG_PREFERENCES_UPDATED = "News preferences updated";
const MSG_SERVER_RUNNING = "Server is running on port ";

module.exports = {
  STATUS_ERROR,
  STATUS_SUCCESS,
  ERR_USER_EXISTS,
  ERR_USER_NOT_FOUND,
  ERR_INVALID_PASSWORD,
  ERR_VALIDATION,
  ERR_SERVER_ERROR,
  ERR_TOKEN_VERIFICATION,
  ERR_MISSING_AUTH_HEADER,
  ERR_SERVER_START,
  ERR_REQUEST_LIMIT_EXCEEDED,
  MSG_SUCCESSFUL_REGISTRATION,
  MSG_SUCCESSFUL_LOGIN,
  MSG_PREFERENCES_UPDATED,
  MSG_SERVER_RUNNING,
};
