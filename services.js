
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { userModel, propertyModel } = require('./schema');



const handleRegister = async (req, res) => {
  const { name, email, phone, city, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const myHashPassword = await bcryptjs.hash(password, 5);

  const newUser = new userModel({
    name,
    email,
    phone,
    city,
    password: myHashPassword,
  });

  try {

    const dbResponse = await userModel.create(newUser);

    if (!dbResponse) {
      return res.status(400).json({ message: 'Error creating user' });
    } else {

      const token = jwt.sign({
        id: dbResponse._id,
        name: dbResponse.name,
        email: dbResponse.email,
      }, process.env.JWT_SECRET)

      res.status(201).json({
        message: 'User created successfully',
        token,
        data: dbResponse

      });
      return;
    }



  } catch (err) {
    return res.status(500).json({ message: 'Error creating user' });
  }
};

const handleLogin = async (req, res) => {

  const { email, password } = req.body;
  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Email' });
    }

    const isValid = await bcryptjs.compare(
      password,
      user.password
    );


    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }


    const token = jwt.sign({
      id: user._id,
      name: user.name,
      email: user.email,
    }, process.env.JWT_SECRET)

    res.status(200).json({
      message: 'Login Successful',
      token,
      data: {
        name: user.name,
        email: user.email,
        city: user.city,
        phone: user.phone
      }
    });

    return;

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in user' });
  }
};

const verifyUser = async (email) => {
  try {
    const userData = await userModel.findOne({ email: email });

    if (userData.email) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

const handleAddProperty = async (req, res) => {
  const { userEmail, type, location, city, price, description, isAvailable } = req.body;

  try {
    const dbResponse = await propertyModel.create({ userEmail, type, location, city, price, description, isAvailable });
    if (!dbResponse) {
      return res.status(400).json({ message: 'Error creating property' });
    } else {
      return res.status(201).json({
        message: 'Property created successfully',
        data: dbResponse
      });
    }
  } catch (err) {
    return res.status(201).json({ message: 'Error creating property for user' });
  }
}

const handleGetAllProperty = async (req, res) => {
  const { email } = req.params;
  try {
    const dbResponse = await propertyModel.find({ userEmail: email });

    if (!dbResponse) {
      return res.status(400).json({ message: 'Error creating property' });
    } else {
      return res.status(201).json({
        message: 'Property fetched successfully',
        data: dbResponse
      });
    }
  } catch (err) {
    return res.status(201).json({ message: 'Error creating property for user' });
  }
}

const handleEditProperty = async (req, res) => {
  const { id, email } = req.query;
  const { type, location, city, price, description } = req.body;

  try {
    const dbResponse = await propertyModel.findOneAndUpdate({ _id: id, userEmail: email }, { $set: { type, location, city, price, description } });
    if (!dbResponse) {
      return res.status(400).json({ message: 'Error updating property' });
    } else {
      return res.status(201).json({
        message: 'Property updated successfully',
        data: dbResponse
      });
    }
  } catch (err) {
    return res.status(201).json({ message: 'Error updating property for user' });
  }
}

const handleDeleteProperty = async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  try {
    const dbResponse = await propertyModel.findOneAndDelete({ _id: id, userEmail: email });
    if (!dbResponse) {
      return res.status(400).json({ message: 'Error deleting property' });
    } else {
      return res.status(201).json({
        message: 'Property deleted successfully',
        data: dbResponse
      });
    }
  } catch (err) {
    return res.status(201).json({ message: 'Error deleting property for user' });
  }
}

const handleUpdateStatus = async (req, res) => {

  const { id } = req.params;
  const { email } = req.query;
  const { isAvailable } = req.body;


  try {
    const dbResponse = await propertyModel.findOneAndUpdate({ _id: id, userEmail: email }, { $set: { isAvailable: isAvailable } });

    if (!dbResponse) {
      return res.status(400).json({ message: 'Error updating property' });
    } else {
      return res.status(201).json({
        message: 'Property updated successfully',
        data: dbResponse
      });
    }
  } catch (err) {
    return res.status(201).json({ message: 'Error updating property for user' });
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  verifyUser,
  handleAddProperty,
  handleGetAllProperty,
  handleEditProperty,
  handleDeleteProperty,
  handleUpdateStatus
};