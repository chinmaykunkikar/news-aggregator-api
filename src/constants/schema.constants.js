// Preferences Schema
const ENUM_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];
const ERR_CATEGORY_ENUM = `categories: Allowed options are '${ENUM_CATEGORIES.join(
  "', '"
)}'.`;
const ERR_SOURCES = "sources: Must be an array of strings.";
const ERR_REQUIRED_CATEGORIES = "The 'categories' field is required.";
const ERR_REQUIRED_SOURCES = "The 'sources' field is required.";
const ID_PREFERENCES = "/schemas/preferences";

// Users Schema
const ERR_USERNAME = "username: should be a string with minimum 3 characters.";
const ERR_PASSWORD = "password: should be a string with minimum 3 characters.";
const ERR_PREFERENCES =
  "The 'preferences' field must be according to the preferences schema.";
const ERR_REQUIRED_USERNAME = "The 'username' field is required.";
const ERR_REQUIRED_PASSWORD = "The 'password' field is required.";
const ID_USERS = "/schema/users";

// Common
const ERR_ADDITIONAL_PROPERTIES =
  "The input should not have additional properties.";

module.exports = {
  ENUM_CATEGORIES,
  ERR_CATEGORY_ENUM,
  ERR_SOURCES,
  ERR_REQUIRED_CATEGORIES,
  ERR_REQUIRED_SOURCES,
  ID_PREFERENCES,
  ERR_USERNAME,
  ERR_PASSWORD,
  ERR_PREFERENCES,
  ERR_REQUIRED_USERNAME,
  ERR_REQUIRED_PASSWORD,
  ID_USERS,
  ERR_ADDITIONAL_PROPERTIES,
};
