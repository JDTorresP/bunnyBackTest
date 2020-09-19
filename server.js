require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (error) => console.error(error) );
db.once('open', () => console.log('SUCCESSFUL CONNECTION TO DB') );


app.use(express.json());

const usersRouter = require('./routes/users-routing')
app.use('/users', usersRouter)

const tasksRouting = require('./routes/tasks-routing')
app.use('/tasks', tasksRouting)


app.listen(port, () => {console.log(`Server Started at http://localhost:${port}`)})