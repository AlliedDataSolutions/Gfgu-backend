import { User } from "./userModel";
import { Credential } from "../auth";
import { AppDataSource } from "../../config/db";
import { Role } from "../auth";

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
}
