const User = require("../Module/User");
const UserMessages = require("../Module/UserMessages");


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
    const messages = await UserMessages.find().sort({ created_at: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
