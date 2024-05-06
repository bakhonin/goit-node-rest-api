import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(HttpError(409, "Email in use"));
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  try {
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return next(HttpError(401, "Email or password is wrong"));
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  const { email } = req.user;
  if (!email) {
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    res.json({
      email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
