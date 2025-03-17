import { User } from "./userModel";
import { Credential } from "../auth";
import { AppDataSource } from "../../config/db";
import { Role } from "../auth";
import { Vendor } from "./vendorModel";
import { ConfirmationStatus } from "./confirmationStatus";

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
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
  user = async (userId: string): Promise<UserResponse | null> => {
    const userRepo = AppDataSource.getRepository(User);
    const credentialRepo = AppDataSource.getRepository(Credential);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return null;

    const credential = await credentialRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!credential) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: credential.role,
      phoneNumber: user.phoneNumber,
      createdDate: user.createdDate,
      modifiedDate: user.modifeidDate,
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
}
