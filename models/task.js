const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        default: 'TODO'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
    }, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  });

module.exports = mongoose.model('Task', taskSchema);