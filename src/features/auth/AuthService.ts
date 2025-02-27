import { AppDataSource } from "../../config/db";
import { User, Vendor } from "../user";
import { Credential } from "./credentialModel";
import bcrypt from "bcrypt";
import { Role } from "./role";

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private credentialRepo = AppDataSource.getRepository(Credential);
  private vendorRepo = AppDataSource.getRepository(Vendor);

  async register(data: any) {
    const { firstName, lastName, email, password, role, businessName } = data;

    // Check if email already exists
    const existingCredential = await this.credentialRepo.findOne({
      where: { email },
    });
    if (existingCredential) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({ firstName, lastName, email });
    await this.userRepo.save(user);

    // Create credential entity
    const credential = this.credentialRepo.create({
      email,
      password: hashedPassword,
      role,
      user,
    });
    await this.credentialRepo.save(credential);

    // If vendor, create vendor entity
    if (role === Role.vendor) {
      const vendor = this.vendorRepo.create({ businessName, user });
      await this.vendorRepo.save(vendor);
    }

    return { message: "User registered successfully" };
  }
}
