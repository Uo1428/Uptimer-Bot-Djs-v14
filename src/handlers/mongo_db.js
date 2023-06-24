const { mongoose } = require("mongoose");
require("colors")
module.exports = {
  async execute(client) {
    try {
        mongoose.connect(client.config.MONGO_DB, {
          autoIndex: false,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          family: 4,
        }).then(() => client.logger("Connected to MongoDB".bold))
          .catch((err) => console.error("MongoDB ❌\n", err));
    } catch (e) {
        console.log(error.stack ? String(error.stack).red : String(error).red)
    }
  }
}