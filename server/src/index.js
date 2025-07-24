const express = require("express");
require('dotenv').config();
const cors = require('cors');
// const userRouter = require("./routes/userRoutes");
const connectDB = require('./dbConnect');


const app = express();
const Port = process.env.PORT
// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors())

// app.use("/users", userRouter);


app.get('/', (req, res) => {
    res.json({ 
    message: '🏋️‍♂️ Gym Management Server is UP!', 
    version: '1.0.0',
    status: 'Running' 
  });
});

app.listen(Port, () => {
    console.log('Server is Started on Port:', Port);
})