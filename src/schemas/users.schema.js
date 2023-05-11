const usersSchema = {
  $id: "/schema/users",
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 3,
      errorMessage: "username: should be a string with minimum 3 characters.",
    },
    password: {
      type: "string",
      minLength: 3,
      errorMessage: "password: should be a string with minimum 3 characters.",
    },
    preferences: {
      $ref: "/schemas/preferences",
      default: { categories: [], sources: [] },
      errorMessage:
        "The 'preferences' field must be according to the preferences schema.",
    },
  },
  required: ["username", "password"],
  additionalProperties: false,
  errorMessage: {
    required: {
      username: "The 'username' field is required.",
      password: "The 'password' field is required.",
    },
    additionalProperties: "The input should not have additional properties.",
  },
};

module.exports = usersSchema;
