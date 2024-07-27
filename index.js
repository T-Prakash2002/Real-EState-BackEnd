const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();


const {
  handleRegister,
  handleLogin,
  verifyUser,
  handleAddProperty,
  handleGetAllProperty,
  handleEditProperty,
  handleDeleteProperty,
  handleUpdateStatus
} = require('./services');

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());


const auth = async (req, res, next) => {
  const token = req.headers.authorization;

  if(req.path == '/api/login' || req.path == '/api/register'){
    next();
  }else{
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const verify=await verifyUser(decoded.email)
      if(verify){
        next();
      }else{
        res.status(401).json({
          message: 'Invalid token'
        });
      }

    }catch(err){
      console.log("Error verifying token");
      return res.status(401).json({
        message: 'Error verifying token'
      });
    }
  }
}

app.use(auth);



connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/register', (req, res) => {
  handleRegister(req, res);
})



app.post('/api/login', async (req, res) => {
  handleLogin(req, res);
})


app.post('/api/addProperty', async (req, res) => {
  handleAddProperty(req, res);
})

app.get('/api/getAllProperty/:email', async (req, res) => {
  handleGetAllProperty(req, res);
})


app.put('/api/editProperty', async (req, res) => {
  handleEditProperty(req, res);
})

app.delete('/api/deleteProperty/:id', async (req, res) => {
  handleDeleteProperty(req, res);
})

app.put('/api/updateStatus/:id', async (req, res) => {
  handleUpdateStatus(req, res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

