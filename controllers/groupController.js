const Group = require("../models/Group");
const User = require("../models/User");

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  try {
    const group = new Group({ name, members: [req.user._id] });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteGroup = async (req, res) => {
  const { id } = req.params;
  try {
    await Group.findByIdAndDelete(id);
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchGroups = async (req, res) => {
  const { name } = req.query;
  try {
    const groups = await Group.find({ name: new RegExp(name, "i") });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
