const mongoose = require("mongoose");
// const validator = require("validator");
// import { zipCode } from '@form-validation/validator-zip-code';

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  streetAddress: {
    type: String,
    required: true,
  },

  apartment: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  zipcode: {
    type: String,
    required: true,
  },

  dob: {
    type: Date,
    validate: {
      validator: function(v) {
        v.setFullYear(v.getFullYear()+18)
        const currentTime = new Date();
        currentTime.setHours(0,0,0,0);
        return v.getTime() <= currentTime.getTime();
      },
      message: props => 'You must be 18 years old.'
    },
    required: true
  },

  ssn: {
    type: String,
    required: true,
  },

  zipcode: {
    type: Number,
    required: true,
    unique: true,
    length: { min: 5, max: 5 }
  }
});

const EmailAccess = mongoose.model("EmailAccess", emailSchema);

module.exports = EmailAccess;