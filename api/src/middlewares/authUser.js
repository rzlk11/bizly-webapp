import Users from "../models/userModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "Silahkan login ke akun anda terlebih dahulu" });
  }
  const user = await Users.findOne({
    where: {
      id: req.session.userId,
    },
  });
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }
  req.userId = user.id;
  next();
};

export const authorized = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      id: req.session.userId,
    },
  });
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }
  if (user.id !== req.params.id) {
    return res.status(403).json({ error: "Akses dilarang" });
  }
  next();
};
