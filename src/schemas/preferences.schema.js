const {
  ENUM_CATEGORIES,
  ERR_SOURCES,
  ID_PREFERENCES,
  ERR_REQUIRED_CATEGORIES,
  ERR_REQUIRED_SOURCES,
  ERR_CATEGORY_ENUM,
  ERR_ADDITIONAL_PROPERTIES,
} = require("../constants/schema.constants");

const preferencesSchema = {
  $id: ID_PREFERENCES,
  type: "object",
  properties: {
    categories: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
        enum: ENUM_CATEGORIES,
      },
      errorMessage: ERR_CATEGORY_ENUM,
    },
    sources: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
      },
      errorMessage: ERR_SOURCES,
    },
  },
  required: ["categories", "sources"],
  additionalProperties: false,
  errorMessage: {
    required: {
      categories: ERR_REQUIRED_CATEGORIES,
      sources: ERR_REQUIRED_SOURCES,
    },
    additionalProperties: ERR_ADDITIONAL_PROPERTIES,
  },
};

module.exports = preferencesSchema;
