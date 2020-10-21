const User = require("../models/User");

const createOrUpdateUser = async (req, res, next) => {
  const { name, picture, email } = req.user;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name: name ? name : email.split("@")[0], picture },
      { new: true }
    );
    if (user) {
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        name: name ? name : email.split("@")[0],
        picture,
      }).save();
      res.json(newUser);
    }
  } catch (error) {
    next(error);
  }
};

const currentUser = (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};
module.exports = {
  createOrUpdateUser,
  currentUser,
};
