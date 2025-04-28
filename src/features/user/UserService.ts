import { User } from "./userModel";
import { Credential } from "../auth/credentialModel";
import { AppDataSource } from "../../config/db";
import { Role } from "../auth/role";
import { Vendor } from "./vendorModel";
import { ConfirmationStatus } from "./confirmationStatus";
import bcrypt from "bcrypt";

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  vendorId?: string;
  phoneNumber: string | null;
  createdDate: Date;
  modifiedDate: Date;
}

export interface FilterUsers {
  page?: number;
  limit?: number;
  search?: string;
  isConfirmed?: boolean;
  account: Role[];
  status: ConfirmationStatus[];
}

export class UserService {
  user = async (userId: string): Promise<any | null> => {
    const userRepo = AppDataSource.getRepository(User);
    const credentialRepo = AppDataSource.getRepository(Credential);
    const vendorRepo = AppDataSource.getRepository(Vendor);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ["vendor"],
    });

    if (!user) return null;

    const credential = await credentialRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!credential) return null;

    let vendorDetails = {
      businessName: "",
      businessDescription: "",
    };

    if (user.vendor) {
      const vendor = await vendorRepo.findOne({
        where: { id: user.vendor.id },
      });
      if (vendor) {
        vendorDetails = {
          businessName: vendor.businessName,
          businessDescription: vendor.businessDescription || "",
        };
      }
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: credential.role,
      vendorId: user.vendor?.id,
      phoneNumber: user.phoneNumber,
      createdDate: user.createdDate,
      modifiedDate: user.modifeidDate,
      vendor: vendorDetails,
    };
  };

  async getAllUsers(filter: FilterUsers) {
    const userRepo = AppDataSource.getRepository(User);

    const {
      page = 1,
      limit = 10,
      search,
      isConfirmed,
      account,
      status,
    } = filter;

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    let query = userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.vendor", "vendor")
      .leftJoinAndSelect(
        Credential,
        "credential",
        "credential.userId = user.id"
      );

    // Apply search filter if provided
    if (search) {
      query = query.andWhere(
        "(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Apply confirmed filter if provided
    if (typeof isConfirmed === "boolean") {
      query = query.andWhere("user.isConfirmed = :isConfirmed", {
        isConfirmed,
      });
    }

    // Apply role filter if provided
    if (account && account.length > 0) {
      query = query.andWhere("credential.role IN (:...account)", { account });
    }

    // Apply vendor status filter if provided
    if (status && status.length > 0) {
      query = query.andWhere("vendor.status IN (:...status)", { status });
    }

    const [users, totalCount] = await query
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      totalCount,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      users,
    };
  }

  async confirmUser(userId: string) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    user.isConfirmed = true;
    await userRepo.save(user);
    return user;
  }

  async setVendorStatus(userId: string, status: ConfirmationStatus) {
    const vendorRepo = AppDataSource.getRepository(Vendor);
    const vendor = await vendorRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });
    if (!vendor) throw new Error("Vendor not found");
    vendor.status = status;
    await vendorRepo.save(vendor);
    return vendor;
  }

  async deleteUser(userId: string) {
    const userRepo = AppDataSource.getRepository(User);
    const credentialRepo = AppDataSource.getRepository(Credential);

    // Check if user exists
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Delete associated credentials if they exist
    await credentialRepo.delete({ user: { id: userId } });

    // Delete the user
    await userRepo.delete(userId);

    return { message: "User deleted successfully" };
  }

  /** Update first & last name */
async updateName(userId: string, firstName: string, lastName: string) {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOneBy({ id: userId });
  if (!user) throw new Error("User not found");
  user.firstName = firstName;
  user.lastName = lastName;
  const result = await repo.save(user);
  return { message: "Name updated successfully", data: result };
}

/** Update email (and Credential.email) */
async updateEmail(userId: string, newEmail: string) {
  const userRepo = AppDataSource.getRepository(User);
  const credRepo = AppDataSource.getRepository(Credential);
    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");
    // TODO: generate & send OTP here via nodemailer
    user.email = newEmail;
    await userRepo.save(user);
    const cred = await credRepo.findOne({ where: { user: { id: userId } } });
    if (cred) {
      cred.email = newEmail;
      await credRepo.save(cred);
    }
    return { message: "Email updated successfully", data: newEmail };
  }

  /** Change password */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const credRepo = AppDataSource.getRepository(Credential);
    const cred = await credRepo.findOne({ where: { user: { id: userId } } });
    if (!cred) throw new Error("Credentials not found");
    const match = await bcrypt.compare(currentPassword, cred.password);
    if (!match) throw new Error("Current password incorrect");
    cred.password = await bcrypt.hash(newPassword, 10);
    await credRepo.save(cred);
    return { message: "Password updated successfully" };
  }
}

export default UserService;
