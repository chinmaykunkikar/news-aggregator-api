module.exports = usersSchema = {
  $id: "/schema/users",
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 3 },
    preferences: {
      $ref: "/schemas/preferences",
      default: { categories: [], sources: [] },
    },
  },
  required: ["id", "username", "password"],
  additionalProperties: false,
};
