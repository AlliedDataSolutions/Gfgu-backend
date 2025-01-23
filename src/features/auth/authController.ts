import { AppDataSource } from "../../config/db";
import { User } from "../user/user";
import { Credential } from "./credentialModel";
import { Request, Response } from 'express';


const register = async (req: Request, res: Response) => {
    // Example: Creating a new user and credential
    const userRepository = AppDataSource.getRepository(User);
    const credentialRepository = AppDataSource.getRepository(Credential);

    const newUser = userRepository.create({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
    });

    const savedUser = await userRepository.save(newUser);

    const newCredential = credentialRepository.create({
    email: "john.doe@example.com",
    password: "securepassword",
    role: "customer",
    user: savedUser,
    });

    await credentialRepository.save(newCredential);
    res.status(200).json({message: "register user"})
}


const login = async (req: Request, res: Response) => {
    // Example: Trying to login
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find()
    res.status(200).json(users)
}

export {register, login}