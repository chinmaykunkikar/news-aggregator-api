const {
  ID_USERS,
  ERR_USERNAME,
  ERR_PASSWORD,
  ERR_PREFERENCES,
  ERR_REQUIRED_USERNAME,
  ERR_REQUIRED_PASSWORD,
  ERR_ADDITIONAL_PROPERTIES,
  ID_PREFERENCES,
} = require("../constants/schema.constants");

const usersSchema = {
  $id: ID_USERS,
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 3,
      errorMessage: ERR_USERNAME,
    },
    password: {
      type: "string",
      minLength: 3,
      errorMessage: ERR_PASSWORD,
    },
    preferences: {
      $ref: ID_PREFERENCES,
      default: { categories: [], sources: [] },
      errorMessage: ERR_PREFERENCES,
    },
  },
  required: ["username", "password"],
  additionalProperties: false,
  errorMessage: {
    required: {
      username: ERR_REQUIRED_USERNAME,
      password: ERR_REQUIRED_PASSWORD,
    },
    additionalProperties: ERR_ADDITIONAL_PROPERTIES,
  },
};

module.exports = usersSchema;
