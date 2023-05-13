const Ajv = require("ajv").default;

const { readUsers, writeUsers } = require("../utils/usersFile.util");
const preferencesSchema = require("../schemas/preferences.schema");
const {
  ERR_USER_NOT_FOUND,
  ERR_VALIDATION,
  ERR_SERVER_ERROR,
  STATUS_ERROR,
  MSG_PREFERENCES_UPDATED,
} = require("../constants/app.constants");

const ajv = new Ajv({ useDefaults: true, allErrors: true });
require("ajv-errors")(ajv);
const validatePreferences = ajv.compile(preferencesSchema);

function getPreferences(req, res) {
  res.json(req.user.preferences);
}

function updatePreferences(req, res) {
  try {
    const preferences = req.body;
    const validBody = validatePreferences(preferences);
    if (validBody) {
      const { id } = req.user;
      let usersData = JSON.parse(JSON.stringify(readUsers()));
      const userIndex = usersData.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ error: ERR_USER_NOT_FOUND });
      }
      usersData[userIndex].preferences = preferences;
      writeUsers(usersData);
      res.status(200).json({ message: MSG_PREFERENCES_UPDATED });
    } else {
      const errors = validatePreferences.errors.map((error) => {
        const { message } = error;
        return { message };
      });
      return res
        .status(400)
        .json({ status: STATUS_ERROR, message: ERR_VALIDATION, errors });
    }
  } catch (error) {
    res.status(500).json({ message: ERR_SERVER_ERROR });
  }
}

module.exports = { getPreferences, updatePreferences };
