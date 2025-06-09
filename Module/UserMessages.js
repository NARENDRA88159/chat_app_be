const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const messageSchema = new Schema({
  message_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  message: {
    type: String,
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender_email: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

const UserMessage = mongoose.model('UserMessage', messageSchema);
module.exports = UserMessage;
