import jwt from "jsonwebtoken";
import { AuthService } from "../../src/features/auth/AuthService";
import { AppDataSource } from "../../src/config/db";
import { User } from "../../src/features/user/userModel";
import { Vendor } from "../../src/features/user/vendorModel";
import { Role } from "../../src/features/auth/role";
import bcrypt from "bcrypt";
import { Credential } from "../../src/features/auth/credentialModel";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService - Unit Tests", () => {
  let authService: AuthService;
  let mockUserRepo: any;
  let mockCredentialRepo: any;
  let mockVendorRepo: any;

  beforeEach(() => {
    authService = new AuthService();

    mockUserRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    mockCredentialRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    mockVendorRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(AppDataSource, "getRepository").mockImplementation((entity) => {
      if (entity === User) return mockUserRepo;
      if (entity === Credential) return mockCredentialRepo;
      if (entity === Vendor) return mockVendorRepo;
      return null;
    });

    jest.spyOn(authService, "sendConfirmationEmail").mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const mockData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        role: Role.customer,
      };

      mockCredentialRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");

      mockUserRepo.create.mockReturnValue(mockData);
      mockUserRepo.save.mockResolvedValue(mockData);

      mockCredentialRepo.create.mockReturnValue({
        email: mockData.email,
        password: "hashed_password",
        role: mockData.role,
        user: mockData,
      });
      mockCredentialRepo.save.mockResolvedValue(true);

      const result = await authService.register(mockData);

      expect(mockCredentialRepo.findOne).toHaveBeenCalledWith({
        where: { email: mockData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);
      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(mockCredentialRepo.create).toHaveBeenCalled();
      expect(mockCredentialRepo.save).toHaveBeenCalled();
      expect(authService.sendConfirmationEmail).toHaveBeenCalledWith(mockData);
      expect(result).toEqual({ message: "User registered successfully" });
    });

    it("should throw an error if email is already in use", async () => {
      const mockData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        role: Role.customer,
      };

      mockCredentialRepo.findOne.mockResolvedValue({ email: mockData.email });

      await expect(authService.register(mockData)).rejects.toThrow("Email already in use");

      expect(mockCredentialRepo.findOne).toHaveBeenCalledWith({
        where: { email: mockData.email },
      });
      expect(mockUserRepo.create).not.toHaveBeenCalled();
      expect(mockCredentialRepo.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should log in a user and return tokens", async () => {
      const mockEmail = "john@example.com";
      const mockPassword = "password123";
      const mockUser = {
        id: "123",
        email: mockEmail,
        isConfirmed: true,
      };
      const mockCredential = {
        email: mockEmail,
        password: "hashed_password",
        role: Role.customer,
      };

      mockCredentialRepo.findOne.mockResolvedValue(mockCredential);
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockImplementation((payload) => `token-${payload.userId}`);

      const result = await authService.login(mockEmail, mockPassword);

      expect(mockCredentialRepo.findOne).toHaveBeenCalledWith({ where: { email: mockEmail } });
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: mockEmail } });
      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, "hashed_password");
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        message: "Login successful",
        accessToken: "token-123",
        refreshToken: "token-123",
      });
    });

    it("should throw an error if user is not found", async () => {
      mockCredentialRepo.findOne.mockResolvedValue(null);
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(authService.login("john@example.com", "password123")).rejects.toThrow(
        "User not found"
      );

      expect(mockCredentialRepo.findOne).toHaveBeenCalled();
      expect(mockUserRepo.findOne).toHaveBeenCalled();
    });

    it("should throw an error if password does not match", async () => {
      const mockCredential = {
        email: "john@example.com",
        password: "hashed_password",
        role: Role.customer,
      };
      const mockUser = {
        id: "123",
        email: "john@example.com",
        isConfirmed: true,
      };

      mockCredentialRepo.findOne.mockResolvedValue(mockCredential);
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login("john@example.com", "wrongpassword")).rejects.toThrow(
        "Email or password not correct"
      );

      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashed_password");
    });

    it("should throw an error if user email is not confirmed", async () => {
      const mockCredential = {
        email: "john@example.com",
        password: "hashed_password",
        role: Role.customer,
      };
      const mockUser = {
        id: "123",
        email: "john@example.com",
        isConfirmed: false,
      };

      mockCredentialRepo.findOne.mockResolvedValue(mockCredential);
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login("john@example.com", "password123")).rejects.toThrow(
        "Please confirm your email before logging in"
      );

      expect(authService.sendConfirmationEmail).toHaveBeenCalledWith(mockUser);
    });
  });
});
