const User = require("../Module/User");
const UserMessages = require("../Module/UserMessages");
const cloudinary = require("../Modules/Cloudinary");
const dotenv = require("dotenv")
dotenv.config();

const streamifier = require('streamifier');
const redis = require("../Modules/RedisClient");
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
    let { limit = 20, page = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    // const cachedData = await redis.get("AllMessages")
    // if (cachedData) {
    //   return res.status(200).json(JSON.parse(cachedData))
    // }
    const skip = (page - 1) * limit;
    const messages = await UserMessages.find().sort({ created_at: -1 }).skip(skip).limit(limit);
    const reversedMessages =  messages.reverse()
    // await redis.set('AllMessages', JSON.stringify(reversedMessages), 'EX', 60);

    res.json(reversedMessages);
  } catch (error) {
    res.status(500).json({ error: error?.message });
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

exports.audios=async (req, res) => {
  try {
    const { sender_id, sender_email } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Cloudinary treats .webm/.mp3 as video
        folder: 'voice_messages',
      },
      async (error, result) => {
        if (error) return res.status(500).json({ error: 'Cloudinary error', detail: error });

        // Save message to DB with Cloudinary URL
        const newMessage = new UserMessages({
          sender_id,
          sender_email,
          audio:result.secure_url, // store Cloudinary URL
        });

        await newMessage.save();



        res.status(201).json({ success: true, message: newMessage });
      }
    );

    // Pipe buffer to Cloudinary
    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer).pipe(uploadResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
}

exports.Images = async (req, res) => {
  try {
    const { sender_id, sender_email } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'upload_image',
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    const newMessage = new UserMessages({
      sender_id,
      sender_email,
      image: result.secure_url,
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });

  } catch (error) {
    console.error("Upload failed", error);
    res.status(500).json({ error: 'Upload failed', detail: error });
  }
};