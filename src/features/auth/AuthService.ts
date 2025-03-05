import nodemailer from "nodemailer";
import { AppDataSource } from "../../config/db";
import { User, Vendor } from "../user";
import { Credential } from "./credentialModel";
import bcrypt from "bcrypt";
import { Role } from "./role";
import jwt, { JwtPayload } from "jsonwebtoken";

// Configure nodemailer (Use a real SMTP service like SendGrid, Mailgun)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a confirmation token
const generateConfirmationToken = (user: User): string => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export class AuthService {
  async register(data: any) {
    const { firstName, lastName, email, password, role, businessName } = data;

    const userRepo = AppDataSource.getRepository(User);
    const credentialRepo = AppDataSource.getRepository(Credential);
    const vendorRepo = AppDataSource.getRepository(Vendor);

    // Check if email already exists
    const existingCredential = await credentialRepo.findOne({
      where: { email },
    });
    if (existingCredential) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({ firstName, lastName, email });
    await userRepo.save(user);

    // Create credential entity
    const credential = credentialRepo.create({
      email,
      password: hashedPassword,
      role,
      user,
    });
    await credentialRepo.save(credential);
    await this.sendConfirmationEmail(user);

    // If vendor, create vendor entity
    if (role === Role.vendor) {
      const vendor = vendorRepo.create({ businessName, user });
      await vendorRepo.save(vendor);
    }

    return { message: "User registered successfully" };
  }

  async login(email: string, password: string) {
    const userRepo = AppDataSource.getRepository(User);
    const credentialRepo = AppDataSource.getRepository(Credential);

    const credential = await credentialRepo.findOne({ where: { email } });
    const user = await userRepo.findOne({ where: { email: email } });
    if (!credential || !user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) throw new Error("Email or password not correct");

    if (!user.isConfirmed)
      throw new Error("Please confirm your email before logging in");

    const accessToken = jwt.sign(
      { userId: user.id, role: credential.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: credential.role },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    return { message: "Login successful", accessToken, refreshToken };
  }

  async confirmEmail(token: string) {
    try {
      const userRepo = AppDataSource.getRepository(User);

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Ensure decoded contains email
      if (!decoded || typeof decoded !== "object" || !decoded.email) {
        throw new Error("Invalid token format");
      }

      const user = await userRepo.findOne({
        where: { email: decoded.email },
      });

      if (!user) throw new Error("User not found");

      user.isConfirmed = true;
      await userRepo.save(user);

      return { message: "Email confirmed successfully" };
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new Error("Unauthorized");

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as JwtPayload;

      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      return { accessToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  // Send confirmation email
  async sendConfirmationEmail(user: User) {
    const token = generateConfirmationToken(user);
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

    console.log("registration token", token);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Confirm Your Email",
      html: `<p>Please click the link below to confirm your email:</p>
           <a href="${confirmUrl}">Confirm Email</a>`,
    };

    await transporter.sendMail(mailOptions);
  }
}
