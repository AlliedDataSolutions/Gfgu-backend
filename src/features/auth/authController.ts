import { NextFunction, Request, Response } from "express";
import { AuthService } from "./AuthService";

const authService = new AuthService();

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res.status(400).json({ message: "Token is required" });
      return;
    }

    const response = await authService.confirmEmail(token as string);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const response = await authService.login(email, password);

    const secure = process.env.NODE_ENV === "production"; // Only send over HTTPS in production
    const sameSite = process.env.NODE_ENV === "production" ? "none" : "lax"
    res.cookie("token", response.accessToken, {
      httpOnly: true, // Prevent JavaScript access
      secure: secure,
      sameSite: sameSite, // Prevent CSRF attacks
    });
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: secure,
      sameSite: sameSite,
    });
    res.status(200).json({
      message: response.message,
      token: response.accessToken,
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const response = await authService.refreshToken(refreshToken);
    res.status(200).json({ token: response.accessToken });
  } catch (error) {
    next(error);
  }
};

export { register, login, confirmEmail, refreshToken, logout };
