const mongoose = require("mongoose");

const card = new mongoose.Schema({
  cardnumber: {
    type: String,
    required: true,
    unique: true,
  },

  expirationdate: {
    type: String,
    required: true,
  },

  cvv: {
    type: String,
    required: true,
  }

});

const Card = mongoose.model("Card", card);

module.exports = Card;