const mongoose = require("mongoose");

const username = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },


});

module.exports = mongoose.model("login", username);
