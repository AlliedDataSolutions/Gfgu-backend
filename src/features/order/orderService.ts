import { AppDataSource } from "../../config/db";
import { Order } from "./orderModel";
import { OrderStatus } from "./orderStatus";
import { OrderLine } from "./orderLineModel";
import { User } from "../user/userModel";
import { Product } from "../product/productModel";

export class OrderService {
  async addOrderLine(userId: string, productId: string, quantity: number) {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const productRepo = AppDataSource.getRepository(Product);
      const orderRepo = AppDataSource.getRepository(Order);
      const orderLineRepo = AppDataSource.getRepository(OrderLine);
  
      // Ensure user exists
      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("User not found");
      }
  
      // Ensure product exists
      const product = await productRepo.findOne({
        where: { id: productId },
        relations: ["vendor"],
      });
      if (!product) {
        throw new Error("Product not found");
      }
  
      // Retrieve vendor from product
      const vendor = product.vendor;
  
      // Find or create order
      let order = await orderRepo.findOne({
        where: { user, status: OrderStatus.pending },
        relations: ["orderLines", "orderLines.product"],
      });
  
      if (!order) {
        order = orderRepo.create({ user, status: OrderStatus.pending, orderLines: [] });
        await orderRepo.save(order); // 🔴 FIX: Save order first so it gets an ID
      }
  
      // Ensure orderLines is initialized
      if (!order.orderLines) {
        order.orderLines = [];
      }
  
      // Find or create order line
      let orderLine = order.orderLines.find((line) => line.product.id === productId);
      if (orderLine) {
        orderLine.quantity += quantity;
      } else {
        orderLine = orderLineRepo.create({
          product,
          quantity,
          unitPrice: product.price,
          vendor,
          order, // 🔴 FIX: Now linking to the already saved order.
        });
        order.orderLines.push(orderLine);
      }
  
      // Save order and order line
      await orderLineRepo.save(orderLine);
      await orderRepo.save(order);
  
      return order;
    } catch (error) {
      console.error("Error adding order line:", error);
      throw new Error("Error adding order line");
    }
  }
  

  async getOrder(userId: string) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      const order = await orderRepo.findOne({
        where: { user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines", "orderLines.product"],
      });
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      throw new Error("Error fetching order");
    }
  }

  async removeOrderLine(userId: string, orderLineId: string) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      const orderLineRepo = AppDataSource.getRepository(OrderLine);

      const order = await orderRepo.findOne({
        where: { user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines"],
      });
      if (!order) {
        throw new Error("Order not found");
      }

      // Ensure orderLines is initialized
      if (!order.orderLines) {
        order.orderLines = [];
      }

      const orderLine = order.orderLines.find(
        (line) => line.id === orderLineId
      );
      if (!orderLine) {
        throw new Error("Order line not found");
      }

      order.orderLines = order.orderLines.filter(
        (line) => line.id !== orderLineId
      );
      await orderLineRepo.remove(orderLine);
      await orderRepo.save(order);

      return order;
    } catch (error) {
      throw new Error("Error removing order line");
    }
  }

  async checkoutOrder(userId: string) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);

      const order = await orderRepo.findOne({
        where: { user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines", "orderLines.product"],
      });
      if (!order) {
        throw new Error("Order not found");
      }

      order.status = OrderStatus.confirmed;
      await orderRepo.save(order);

      return order;
    } catch (error) {
      throw new Error("Error checking out order");
    }
  }

  async updateOrderLineQuantity(
    userId: string,
    orderLineId: string,
    quantity: number
  ) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      const orderLineRepo = AppDataSource.getRepository(OrderLine);

      const order = await orderRepo.findOne({
        where: { user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines"],
      });
      if (!order) {
        throw new Error("Order not found");
      }

      // Ensure orderLines is initialized
      if (!order.orderLines) {
        order.orderLines = [];
      }

      const orderLine = order.orderLines.find(
        (line) => line.id === orderLineId
      );
      if (!orderLine) {
        throw new Error("Order line not found");
      }

      orderLine.quantity = quantity;
      await orderLineRepo.save(orderLine);

      return orderLine;
    } catch (error) {
      throw new Error("Error updating order line quantity");
    }
  }

  //Method to get orders for a specified user
  async getUserOrders(userId: string) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      const orders = await orderRepo.find({
        where: { user: { id: userId } },
        relations: ["orderLines", "orderLines.product"],
      });
      return orders;
    } catch (error) {
      throw new Error("Error fetching user orders");
    }
  }

  //Admin method to get all orders
  async getAllOrders() {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      const orders = await orderRepo.find({
        relations: ["user", "orderLines", "orderLines.product"],
      });
      return orders;
    } catch (error) {
      throw new Error("Error fetching all orders");
    }
  }

  //Vendor method to get products on orders
  async getVendorOrders(vendorId: string, page: number, limit: number) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
  
      // Updated query to properly join products with vendor
      const [orders, count] = await orderRepo
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.orderLines", "orderLine")
        .leftJoinAndSelect("orderLine.product", "product") 
        .innerJoin("product.vendor", "vendor") // 🔴 FIX: Ensure vendor relation is correctly linked
        .where("vendor.id = :vendorId", { vendorId })
        .orderBy("order.orderDate", "DESC") // Optional: Show newest orders first
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
  
      return { records: orders, count };
    } catch (error) {
      console.error("Error in getVendorOrders:", error);
      throw new Error("Error fetching vendor orders");
    }
  }
  
}