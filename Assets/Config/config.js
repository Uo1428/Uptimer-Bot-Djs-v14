module.exports = {
  TOKEN: process.env.TOKEN || "",
  MONGO_DB: process.env.MONGO_DB || "",
  CLIENT_ID: process.env.CLIENT_ID || "",
  OWNERS: [""],
  SUPPORT_SERVER: "",
  CHANNELS: {
    COMMANDS_LOGS: "",
    ERROR_COMMAND_LOGS: ""
  }
}