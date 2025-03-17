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
      const product = await productRepo.findOne({ where: { id: productId }, relations: ["vendor"] });
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
      }

      // Ensure orderLines is initialized
      if (!order.orderLines) {
        order.orderLines = [];
      }

      // Find or create order line
      let orderLine = order.orderLines.find(
        (line) => line.product.id === productId
      );
      if (orderLine) {
        orderLine.quantity += quantity;
      } else {
        orderLine = orderLineRepo.create({ product, quantity, unitPrice: product.price, vendor });
        orderLine.order = order; // Ensure the order is set on the order line
        order.orderLines.push(orderLine);
      }

      // Save order and order line
      await orderLineRepo.save(orderLine);
      await orderRepo.save(order);

      return order;
    } catch (error) {
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

      console.log(`Finding order for user: ${userId} with status pending`);
      const order = await orderRepo.findOne({
        where: { user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines"],
      });
      if (!order) {
        console.error("Order not found");
        throw new Error("Order not found");
      }

      // Ensure orderLines is initialized
      if (!order.orderLines) {
        order.orderLines = [];
      }

      // Ensure orderLines is initialized
      if (!order.orderLines) {
        order.orderLines = [];
      }
      console.log(`Order lines: ${JSON.stringify(order.orderLines)}`);
      console.log(`Finding order line with ID: ${orderLineId}`);
      const orderLine = order.orderLines.find(
        (line) => line.id === orderLineId
      );
      if (!orderLine) {
        console.error("Order line not found");
        throw new Error("Order line not found");
      }

      // Remove the order line
      console.log(`Removing order line with ID: ${orderLineId}`);
      await orderLineRepo.remove(orderLine);

      // Update the order's orderLines array and save the order
      order.orderLines = order.orderLines.filter(
        (line) => line.id !== orderLineId
      );
      console.log(`Saving updated order for user: ${userId}`);
      await orderRepo.save(order);

      return order;
    } catch (error) {
      console.error("Error removing order line:", error);
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

      console.log(`Finding order line with ID: ${orderLineId}`);
      const orderLine = await orderLineRepo.findOne({
        where: { id: orderLineId },
        relations: ["order"],
      });

      if (!orderLine) {
        console.error("Order line not found");
        throw new Error("Order line not found");
      }

      console.log(`Order line found: ${JSON.stringify(orderLine)}`);
      console.log(`Verifying order for user: ${userId} with status pending`);
      const order = await orderRepo.findOne({
        where: { id: orderLine.order.id, user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines"],
      });

      if (!order) {
        console.error("Order not found or does not belong to the user");
        throw new Error("Order not found or does not belong to the user");
      }

      console.log(`Order verified: ${JSON.stringify(order)}`);
      console.log(`Updating order line quantity to: ${quantity}`);
      orderLine.quantity = quantity;
      await orderLineRepo.save(orderLine);

      console.log(`Order line updated: ${JSON.stringify(orderLine)}`);
      return orderLine;
    } catch (error) {
      console.error("Error updating order line quantity:", error);
      throw new Error("Error updating order line quantity");
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
  async getVendorProductsOnOrders(vendorId: string) {
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
}