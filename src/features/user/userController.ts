import { AppDataSource } from "../../config/db";
import { User } from "../user/user";
import { Request, Response } from 'express';


const user = async (req: Request, res: Response) => {
    // Example: Fetching a user
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find()
    res.status(200).json(users)
}

export {user}