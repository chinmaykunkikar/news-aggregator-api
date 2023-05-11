const preferencesSchema = {
  $id: "/schemas/preferences",
  type: "object",
  properties: {
    categories: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
        enum: [
          "business",
          "entertainment",
          "general",
          "health",
          "science",
          "sports",
          "technology",
        ],
      },
      errorMessage:
        "categories: Allowed categories are 'business' 'entertainment' 'general' 'health' 'science' 'sports' 'technology'.",
    },
    sources: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
      },
      errorMessage: "sources: Must be an array of strings.",
    },
  },
  required: ["categories", "sources"],
  errorMessage: {
    required: {
      categories: "The 'categories' field is required.",
      sources: "The 'sources' field is required.",
    },
  },
};

module.exports = preferencesSchema;
