const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');

//Get All Tasks by User ID
router.get('/:assigned_id', async (req, res) => {
    const user = await getUser(req.params.assigned_id);
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