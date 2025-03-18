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

      // Find the order for the user with pending status
      const order = await orderRepo.findOne({
        where: { user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines"],
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (!order.orderLines) {
        order.orderLines = [];
      }
      
      // Find the order line
      const orderLine = order.orderLines.find(line => line.id === orderLineId);

      if (!orderLine) {
        throw new Error("Order line not found");
      }

      // Remove the order line
      await orderLineRepo.remove(orderLine);

      // Update the order's orderLines array and save the order
      order.orderLines = order.orderLines.filter(line => line.id !== orderLineId);
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

  async updateOrderLineQuantity(userId: string, orderLineId: string, quantity: number) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      const orderLineRepo = AppDataSource.getRepository(OrderLine);

      // Find the order line
      const orderLine = await orderLineRepo.findOne({
        where: { id: orderLineId },
        relations: ["order"],
      });

      if (!orderLine) {
        throw new Error("Order line not found");
      }

      // Verify the order belongs to the user and is pending
      const order = await orderRepo.findOne({
        where: { id: orderLine.order.id, user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines"],
      });

      if (!order) {
        throw new Error("Order not found or does not belong to the user");
      }

      // Update the quantity
      orderLine.quantity = quantity;
      await orderLineRepo.save(orderLine);

      return orderLine;
    } catch (error) {
      throw new Error("Error updating order line quantity");
    }
  }

  //Vendor method to get products on orders
  async vendorOrderLine(vendorId: string) {
    try {
      const productRepo = AppDataSource.getRepository(Product);

      const products = await productRepo.find({
        where: { vendor: { id: vendorId } },
        relations: ["orderLines", "orderLines.order"],
      });

      return products;
    } catch (error) {
      throw new Error("Error fetching orders");
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

}