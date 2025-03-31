import { NextFunction, Request, Response } from "express";
import { AuthService } from "./AuthService";

export class AuthController {
  constructor(private authService: AuthService) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        res.status(400).json({ message: "Token is required" });
        return;
      }

      const response = await this.authService.confirmEmail(token as string);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const response = await this.authService.login(email, password);

      // const isProduction = process.env.NODE_ENV === "production"; // Only send over HTTPS in production

      // res.cookie("token", response.accessToken, {
      //   httpOnly: true, // Prevent JavaScript access
      //   secure: isProduction,
      //   sameSite: isProduction ? "none" : "lax", // Prevent CSRF attacks
      // });
      // res.cookie("refreshToken", response.refreshToken, {
      //   httpOnly: true,
      //   secure: isProduction,
      //   sameSite: isProduction ? "none" : "lax",
      // });
      res.status(200).json({
        message: response.message,
        token: response.accessToken,
        refreshToken: response.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const response = await this.authService.refreshToken(refreshToken);
      res.status(200).json({ token: response.accessToken });
    } catch (error) {
      next(error);
    }
  };
}
