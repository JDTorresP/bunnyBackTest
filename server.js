// require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const serverless = require('serverless-http');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (error) => console.error(error) );
db.once('open', () => console.log('SUCCESSFUL CONNECTION TO DB') );


app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

const usersRouter = require('./routes/users-routing')
app.use('/users', usersRouter)

const tasksRouting = require('./routes/tasks-routing')
app.use('/tasks', tasksRouting)


const specialTaskRouting = require('./routes/special-task-routing')
app.use('/tasks/assigned', specialTaskRouting)


// app.listen(3000, () => {console.log(`Server Started at http://localhost:${3000}`)})

module.exports.handler = serverless(app);