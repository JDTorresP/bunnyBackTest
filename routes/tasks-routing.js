const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');

//Get all
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.json(tasks);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

//Get One
router.get('/:id', getTask, (req, res) => {
    res.json(res.task)
});

//Get All Tasks by User ID
router.get('assigned/:assigned_id', async (req, res) => {
    console.log('ENTER')
    const user = await getUser(req.param.assigned_id);
    const userResponse = getUserResponse(user, res);
    if(!!userResponse) return userResponse;
    let taskList
    try {
        taskList = await Task.find({user_id: user._id})
        if (taskList === null) {
            return res.status(404).json({ message: 'Cannot find task associated with the user provided' })
        }
    } catch(err) {
        if(err.kind === "ObjectId"){
            return res.status(500).json({ message: err.message, reason: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters" })  
        }else {
            return res.status(500).json({ message: err.message })
        }
       
    } 
    res.json(taskList)
});

//Create One
router.post('/', async (req, res) => {

    const user = await getUser(req.body.user_id);
    const userResponse = getUserResponse(user, res);
    if(!!userResponse) return userResponse;
    
    const task = new Task({
        description: req.body.description,
        state: req.body.state,
        user_id: user._id
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
});

//Update One 
router.patch('/:id', getTask, async (req, res) => {
    let user;
    if(req.body.user_id !== null) {
        user = await getUser(req.body.user_id);
        const userResponse = getUserResponse(user, res);
        if(!!userResponse) return userResponse;
        res.task.user_id = user._id; 
    }
    

    if(req.body.description !== null) {
        res.task.description = req.body.description;
    }
    if(req.body.state !== null) {
        res.task.state = req.body.state;
    }
    
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
});

//Delete One 
router.delete('/:id', getTask, async (req, res) => {
    try {
        await res.task.remove()
        res.json({ message: 'Deleted task' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

async function getTask(req, res, next) {
    let task
    try {
        task = await Task.findById(req.params.id)
        if (task === null) {
            return res.status(404).json({ message: 'Cannot find task' })
        }
    } catch(err) {
        if(err.kind === "ObjectId"){
            return res.status(500).json({ message: err.message, reason: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters" })  
        }else {
            return res.status(500).json({ message: err.message })
        }
       
    } 
    res.task = task;
    next();
}

function getUserResponse(user, res) {
    if (!user) {
        return res.status(404).json({ message: 'Cannot find User to assign Task' })
    } else if(!!user.error) {
        return res.status(500).json(
            user.error.reason ? { message: user.error.message, reason: user.reason } : { message: user.error.message } );  
    }
}

async function getUser(user_id) {
    let user;
    try {
        user = await User.findById(user_id)
    } catch(err) {
        if(err.kind === "ObjectId"){
            return { error: err, reason: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters" }
        }else {
            return { error: err }
        }
    } 
    return user;
}

module.exports = router;