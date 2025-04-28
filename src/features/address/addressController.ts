import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../config/db";
import { Address } from "./addressModel";

/**
 * Get all addresses for the authenticated user.
 */
export const getUserAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const addressRepo = AppDataSource.getRepository(Address);
    const addresses = await addressRepo.find({
      where: { user: { id: req.user.id } },
    });

    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new address for the authenticated user.
 */
export const addUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { streetName, city, province, postalCode, addressType } = req.body;
    const addressRepo = AppDataSource.getRepository(Address);

    const newAddress = addressRepo.create({
      addressType,
      streetName,
      town: city,       // map incoming 'city' to entity's 'town'
      province,
      postalCode,
      user: { id: req.user.id },
    });

    const saved = await addressRepo.save(newAddress);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an address by ID for the authenticated user.
 */
export const deleteUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const addressRepo = AppDataSource.getRepository(Address);

    const address = await addressRepo.findOne({ where: { id } });
    if (!address) {
      res.status(404).json({ message: "Address not found" });
      return;
    }

    await addressRepo.remove(address);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing address by ID for the authenticated user.
 */
export const updateUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { streetName, city, province, postalCode, addressType } = req.body;
    const addressRepo = AppDataSource.getRepository(Address);

    const address = await addressRepo.findOne({ where: { id } });
    if (!address) {
      res.status(404).json({ message: "Address not found" });
      return;
    }

    // Apply updates
    address.streetName = streetName ?? address.streetName;
    address.town = city ?? address.town;
    address.province = province ?? address.province;
    address.postalCode = postalCode ?? address.postalCode;
    address.addressType = addressType ?? address.addressType;

    const updated = await addressRepo.save(address);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
