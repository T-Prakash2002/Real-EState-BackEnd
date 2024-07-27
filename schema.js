
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,

  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,

  },
  city: {
    type: String,

  },
  password: {
    type: String,

  },
  
});

const propertySchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  type: {
    type: String,
  },
  location: {
    type: String,
  },
  city: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
  },
});

const userModel = mongoose.model('user', userSchema);
const propertyModel = mongoose.model('property', propertySchema);

module.exports = {
  userModel,
  propertyModel
};