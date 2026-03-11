const User = require("../models/User");

exports.getPeople = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("_id firstName lastName email status")
      .sort({ firstName: 1, lastName: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch people" });
  }
};
