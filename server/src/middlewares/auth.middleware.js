import { verifyToken, verifyRefreshToken, generateToken } from "../utils/token.util.js";

export const isAuthenticated = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: "Authentication invalid" });
  }

  try {
    const payload = verifyToken(accessToken);
    req.user = { id: payload.id };
    return next();
  } catch (error) {
    if (error.name !== "TokenExpiredError" || !refreshToken) {
      return res.status(401).json({ message: "Authentication invalid" });
    }

    try {
      const refreshPayload = verifyRefreshToken(refreshToken);
      const newAccessToken = generateToken(refreshPayload.id);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      req.user = { id: refreshPayload.id };
      return next();
    } catch (refreshError) {
      return res.status(401).json({ message: "Authentication invalid" });
    }
  }
};