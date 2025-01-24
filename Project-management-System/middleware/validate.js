const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  next();
};

module.exports = { validateEmail };
