module.exports =  preferencesSchema = {
  $id: "/schemas/preferences",
  type: "object",
  properties: {
    categories: {
      type: "array",
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
    },
    sources: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["categories", "sources"],
};
