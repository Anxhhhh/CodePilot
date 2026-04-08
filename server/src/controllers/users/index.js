import UserModel from "../../models/user.model.js";
import { created, customError, success } from "../../utils/response.util.js";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.util.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!password) {
      return customError(res, {}, 400, "Password is required");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = generateToken(newUser._id);
    const newRefreshToken = generateRefreshToken(newUser._id);

    // Save refresh token to user
    newUser.refreshToken = newRefreshToken;
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return created(
      res,
      { user: userResponse, accessToken, refreshToken: newRefreshToken },
      "User created successfully",
    );
  } catch (error) {
    if (error.code === 11000) {
      return customError(res, {}, 400, "User already exists");
    }
    return customError(res, {}, 500, error.message || "Error creating user");
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return customError(res, {}, 400, "Email and password are required");
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      return customError(res, {}, 404, "User not found");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return customError(res, {}, 401, "Invalid password");
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return success(
      res,
      { user: userResponse, accessToken, refreshToken },
      "User logged in successfully",
    );
  } catch (error) {
    return customError(res, {}, 500, error.message || "Error logging in user");
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return customError(res, {}, 400, "Refresh token is required");
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return customError(res, {}, 401, "Invalid refresh token");
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Rotate refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    return success(
      res,
      { accessToken: newAccessToken, refreshToken: newRefreshToken },
      "Token refreshed successfully",
    );
  } catch (error) {
    return customError(res, {}, 401, "Invalid or expired refresh token");
  }
};