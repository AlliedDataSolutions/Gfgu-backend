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

  async getAllUsers(
    search?: string,
    role?: string,
    isConfirmed?: boolean,
    vendorStatus?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;
    const userRepo = AppDataSource.getRepository(User);

    let query = userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.vendor", "vendor")
      .leftJoinAndSelect(
        Credential,
        "credential",
        "credential.userId = user.id"
      );

    if (search) {
      query = query.andWhere(
        "user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search",
        { search: `%${search}%` }
      );
    }

    if (role) {
      query = query.andWhere("credential.role = :role", { role });
    }

    if (isConfirmed !== undefined) {
      query = query.andWhere("user.isConfirmed = :isConfirmed", {
        isConfirmed,
      });
    }

    if (vendorStatus) {
      query = query.andWhere("vendor.status = :vendorStatus", { vendorStatus });
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
}
