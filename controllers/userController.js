const User = require("../models/User");

exports.createUser = async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    const user = new User({ username, password, isAdmin });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchUsers = async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({ username: new RegExp(username, "i") });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
