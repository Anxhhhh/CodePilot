import UserModel from "../../models/user.model.js";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.util.js";

/**
 * Service to refresh access and refresh tokens
 * @param {string} refreshToken - The current refresh token
 * @returns {Promise<object>} - New tokens and user details
 */
export const refreshAuthTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await UserModel.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  // Generate new tokens
  const newAccessToken = generateToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Rotate refresh token in DB
  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};



