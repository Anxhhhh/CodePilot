import UserModel from "../../models/user.model.js";
import { created, customError, success } from "../../utils/response.util.js";
import {
  generateToken,
  generateRefreshToken,
} from "../../utils/token.util.js";
import bcrypt from "bcryptjs";
import { refreshAuthTokens } from "../../services/auth/index.js";

export const createUser = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    let { username, email, password } = req.body;

    if (!password) {
      console.log("Registration failed: Password is required");
      return customError(res, {}, 400, "Password is required");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Creating user in database...");
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
    console.log("User created and tokens saved.");

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("Registration successful for:", email);
    return created(
      res,
      { user: userResponse, accessToken, refreshToken: newRefreshToken },
      "User created successfully",
    );
  } catch (error) {
    console.error("Registration error:", error);
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    const { refreshToken } = req.body || req.cookies;

    if (!refreshToken) {
      return customError(res, {}, 400, "Refresh token is required");
    }

    const { user, accessToken, refreshToken: newRefreshToken } = await refreshAuthTokens(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return success(
      res,
      { accessToken, refreshToken: newRefreshToken },
      "Token refreshed successfully",
    );
  } catch (error) {
    return customError(res, {}, 401, error.message || "Invalid or expired refresh token");
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    
    if (!user) {
      return customError(res, {}, 404, "User not found");
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return success(
      res,
      { user: userResponse },
      "Current user profile fetched successfully"
    );
  } catch (error) {
    return customError(res, {}, 500, error.message || "Error fetching current user profile");
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return success(res, {}, "User logged out successfully");
  } catch (error) {
    return customError(res, {}, 500, error.message || "Error logging out user");
  }
};

