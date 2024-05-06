import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";

const { SECRET_KEY } = process.env;


const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "User not found"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Email or password is wrong"));
  }
};

export default authenticate;
