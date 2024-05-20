const Message = require("../models/Message");
const Group = require("../models/Group");

exports.sendMessage = async (req, res) => {
  const { content, groupId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const message = new Message({
      content,
      user: req.user._id,
      group: groupId,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.likeMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (!message.likes.includes(req.user._id)) {
      message.likes.push(req.user._id);
      await message.save();
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
