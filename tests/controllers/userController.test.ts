import { Request, Response, NextFunction } from "express";
import { AdminController } from "../../src/features/admin/adminController";
import { UserService } from "../../src/features/user/UserService";
import { ConfirmationStatus } from "../../src/features/user/confirmationStatus";
import { User } from "../../src/features/user/userModel";

jest.mock("../../src/features/user/UserService");

describe("User Controller - Unit Tests", () => {
  let mockUserService: jest.Mocked<UserService>;
  let adminController: AdminController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    adminController = new AdminController(mockUserService); // Inject mock service

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return 200 with user data", async () => {
      mockReq.body = { page: 1, limit: 10, account: [], status: [] };
      const mockResult = {
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        users: [
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
            orders: [],
          },
        ],
      };
      mockUserService.getAllUsers.mockResolvedValue(mockResult);

      await adminController.getAllUsers(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should call next() on error", async () => {
      mockReq.body = { page: 1, limit: 10 };
      mockUserService.getAllUsers.mockRejectedValue(new Error("DB Error"));

      await adminController.getAllUsers(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("confirmUser", () => {
    it("should return 200 and confirm user", async () => {
      mockReq.params = { userId: "123" };
      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        isConfirmed: true,
        phoneNumber: "1234567890",
        createdDate: new Date(),
        updatedDate: new Date(),
        modifeidDate: new Date(),
        orders: [],
      };
      mockUserService.confirmUser.mockResolvedValue(mockUser);

      await adminController.confirmUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockUserService.confirmUser).toHaveBeenCalledWith("123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User confirmed successfully",
        user: mockUser,
      });
    });

    it("should call next() on error", async () => {
      mockReq.params = { userId: "123" };
      mockUserService.confirmUser.mockRejectedValue(new Error("Not found"));

      await adminController.confirmUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("setVendorStatus", () => {
    it("should return 200 and update vendor status", async () => {
      mockReq.params = { userId: "123" };
      mockReq.body = { status: ConfirmationStatus.confirmed };
      const mockVendor = {
        id: "123",
        status: ConfirmationStatus.confirmed,
        user: { id: "user123" } as User,
        businessName: "BusinessName",
      };
      mockUserService.setVendorStatus.mockResolvedValue(mockVendor);

      await adminController.setVendorStatus(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockUserService.setVendorStatus).toHaveBeenCalledWith(
        "123",
        ConfirmationStatus.confirmed
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Vendor status updated successfully",
        vendor: mockVendor,
      });
    });

    it("should return 400 if status is invalid", async () => {
      mockReq.params = { userId: "123" };
      mockReq.body = { status: "invalid_status" };

      await adminController.setVendorStatus(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid vendor status",
      });
    });

    it("should call next() on error", async () => {
      mockReq.params = { userId: "123" };
      mockReq.body = { status: ConfirmationStatus.pending };
      mockUserService.setVendorStatus.mockRejectedValue(new Error("Error"));

      await adminController.setVendorStatus(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("deleteUser", () => {
    it("should return 200 and delete user", async () => {
      mockReq.params = { userId: "123" };
      mockUserService.deleteUser.mockResolvedValue({
        message: "User deleted successfully",
      });

      await adminController.deleteUser(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockUserService.deleteUser).toHaveBeenCalledWith("123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });
  });
});
