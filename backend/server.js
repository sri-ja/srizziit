const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.set('strictQuery',false)
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


const usersRouter = require('./routes/user');
app.use('/api/user', usersRouter);

const subGreddiitsRouter = require('./routes/subgreddiit');
app.use('/api/subgreddiit', subGreddiitsRouter);

const postsRouter = require('./routes/post');
app.use('/api/post', postsRouter);

const reportsRouter = require('./routes/report');
app.use('/api/report', reportsRouter);

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});