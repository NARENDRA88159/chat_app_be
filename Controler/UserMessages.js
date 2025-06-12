const User = require("../Module/User");
const UserMessages = require("../Module/UserMessages");
const cloudinary = require("../Modules/Cloudinary");


exports.createMessage = async (req, res) => {
  try {
    const { message, sender_id } = req.body;

    // Fetch user email using sender_id
    const user = await User.findById(sender_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newMessage = await UserMessages.create({
      message,
      sender_id,
      sender_email: user.email
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await UserMessages.find().sort({ created_at: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const { message_id } = req.body;

    const findMessage = await UserMessages.findOne({ message_id });

    if (!findMessage) {
      return res.status(400).json({ error: "Invalid message ID" });
    }

    findMessage.message = null;
    findMessage.delete_for_everyone = true;

    await findMessage.save(); // Save the updated document


    // await findMessage.deleteOne();
    const newdata=await UserMessages.findOne({ message_id })

    res.status(200).json({ message: "Message deleted successfully",data:newdata });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateMessage = async (req, res) => {
  try {
    const { message_id, message } = req.body
    const findMessage = await UserMessages.findOne({ message_id });

    if (!findMessage) {
      return res.status(400).json({ error: "Invalid message ID" });
    }

    await findMessage.updateOne({ message: message });
    const newdata=await UserMessages.findOne({ message_id })

    res.status(200).json({ message: "Message Update successfully",data:newdata });

  }catch (error) {
    res.status(500).json({error:error.message})
    }
}

// exports.audios=async (req, res) => {
//   try {
//     const { sender_id, sender_email } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: 'No audio file uploaded' });
//     }

//     // Upload to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'video', // Cloudinary treats .webm/.mp3 as video
//         folder: 'voice_messages',
//       },
//       async (error, result) => {
//         if (error) return res.status(500).json({ error: 'Cloudinary error', detail: error });

//         // Save message to DB with Cloudinary URL
//         const newMessage = new UserMessages({
//           sender_id,
//           sender_email,
//           audio: result.secure_url, // store Cloudinary URL
//         });

//         await newMessage.save();

//         req.io?.emit('ReceiveAudioMessage', newMessage); // emit to other users via socket

//         res.status(201).json({ success: true, message: newMessage });
//       }
//     );

//     // Pipe buffer to Cloudinary
//     const streamifier = require('streamifier');
//     streamifier.createReadStream(req.file.buffer).pipe(uploadResult);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Upload failed' });
//   }
// }