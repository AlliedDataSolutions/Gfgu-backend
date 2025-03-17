import { AppDataSource } from "../../src/config/db";
import { Repository, SelectQueryBuilder } from "typeorm";
import { UserService } from "../../src/features/user/UserService";
import { User } from "../../src/features/user/userModel";
import { Credential } from "../../src/features/auth/credentialModel";

jest.mock("../../src/config/db");

describe("UserService", () => {
  let userService: UserService;
  let userRepo: jest.Mocked<Repository<User>>;
  let credentialRepo: jest.Mocked<Repository<Credential>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<User>>;

  beforeEach(() => {
    // Mock repository behavior
    userRepo = {
      findOne: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;

    credentialRepo = {
      delete: jest.fn(),
    } as any;

    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    } as any;

    (userRepo.createQueryBuilder as jest.Mock).mockReturnValue(queryBuilder);

    // Mock TypeORM repository
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return userRepo;
      if (entity === Credential) return credentialRepo;
      return null;
    });

    userService = new UserService();
  });

  describe("deleteUser", () => {
    it("should delete a user when found", async () => {
      const mockUser = { id: "123" } as User;

      userRepo.findOne.mockResolvedValue(mockUser);

      await userService.deleteUser("123");

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
      expect(credentialRepo.delete).toHaveBeenCalledWith({
        user: { id: "123" },
      });
      expect(userRepo.delete).toHaveBeenCalledWith("123");
    });

    it("should throw an error when user is not found", async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(userService.deleteUser("nonexistent-id")).rejects.toThrow(
        "User not found"
      );

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: "nonexistent-id" },
      });
      expect(credentialRepo.delete).not.toHaveBeenCalled();
      expect(userRepo.delete).not.toHaveBeenCalled();
    });
  });

  describe("getAllUsers", () => {
    it("should return paginated users", async () => {
      const mockUsers = [
        { 
          id: "123", 
          firstName: "John", 
          lastName: "Doe", 
          email: "john@example.com", 
          isConfirmed: true, 
          phoneNumber: "1234567890", 
          createdDate: new Date(), 
          updatedDate: new Date(),
          modifeidDate: new Date(),
          orders: []
        },
      ];

      queryBuilder.getManyAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await userService.getAllUsers({
        page: 1,
        limit: 10,
        account: [],
        status: [],
      });

      expect(result).toEqual({
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        users: mockUsers,
      });
    });

    it("should return empty if no users found", async () => {
      queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await userService.getAllUsers({
        page: 1,
        limit: 10,
        account: [],
        status: [],
      });

      expect(result).toEqual({
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        users: [],
      });
    });
  });
});
