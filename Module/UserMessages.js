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
    // required: true,
  },
  audio: {
    type: String, // file path or URL to the audio file
  },
  image: {
    type: String
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
  },
  delete_for_me: {
    type: Boolean,
    default:false
  },
  delete_for_everyone: {
    type: Boolean,
    default:false
  }

});

const UserMessage = mongoose.model('UserMessage', messageSchema);
module.exports = UserMessage;
