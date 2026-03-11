const User = require("../models/User");

exports.getProfile = async(req, res) => {

    const user = await User.findById(req.user._id);

    res.json(user);

};

exports.updateProfile = async(req, res) => {

    const { firstName, lastName, avatarLink } = req.body;

    const user = await User.findById(req.user._id);

    user.firstName = firstName;
    user.lastName = lastName;
    user.avatarLink = avatarLink;

    await user.save();

    res.json(user);

};

exports.updateStatus = async(req, res) => {

    const { status } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { status }, { new: true });

    res.json(user);

};