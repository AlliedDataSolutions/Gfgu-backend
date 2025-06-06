import { AppDataSource } from "../../config/db";
import { Order } from "./orderModel";
import { OrderStatus } from "./orderStatus";
import { OrderLine } from "./orderLineModel";
import { OrderLineStatus } from "./orderStatus";
import { User } from "../user/userModel";
import { Product } from "../product/productModel";
import { Vendor } from "../user";
import { VendorBalance } from "../vendor/vendorBalanceModel";
import { Transaction } from "./transactionModel";
import { TransactionStatus } from "./transactionStatus";

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
        where: { user: { id: userId }, status: OrderStatus.pending },
        relations: ["orderLines", "orderLines.product"],
      });

      if (!order) {
        order = orderRepo.create({
          user,
          status: OrderStatus.pending,
          orderLines: [],
        });
      }

      // Ensure orderLines is initialized
      if (!order.orderLines) {
        order.orderLines = [];
      }

      // Find or create order line
      let orderLine = order.orderLines.find(
        (line) => line.product && line.product.id === productId
      );
      if (orderLine) {
        orderLine.quantity += quantity;
      } else {
        orderLine = orderLineRepo.create({
          product,
          quantity,
          unitPrice: product.price,
          vendor,
        });
        orderLine.order = order; // Ensure the order is set on the order line
        order.orderLines.push(orderLine);
      }

      // Save order and order line
      await orderLineRepo.save(orderLine);
      await orderRepo.save(order);

      return order;
    } catch (error) {
      console.log(error)
      throw new Error("Error adding order line");
    }
  }

  async getOrder(userId?: string) {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { user: { id: userId }, status: OrderStatus.pending },
      relations: {
        orderLines: {
          product: {
            images: true,
          },
          vendor: true,
        },
      },
    });
    return order;
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
      const orderLine = order.orderLines.find(
        (line) => line.id === orderLineId
      );

      if (!orderLine) {
        throw new Error("Order line not found");
      }

      // Remove the order line
      await orderLineRepo.delete(orderLine);

      // Update the order's orderLines array and save the order
      order.orderLines = order.orderLines.filter(
        (line) => line.id !== orderLineId
      );
      await orderRepo.save(order);

      return order;
    } catch (error) {
      throw new Error("Error removing order line");
    }
  }

  async updateOrderLineQuantity(
    userId: string,
    orderLineId: string,
    quantity: number
  ) {
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
      where: {
        id: orderLine.order.id,
        user: { id: userId },
        status: OrderStatus.pending,
      },
      relations: {
        orderLines: {
          product: {
            images: true,
          },
          vendor: true,
        },
      },
    });

    if (!order) {
      throw new Error("Order not found or does not belong to the user");
    }

    // Update the quantity
    orderLine.quantity = quantity;
    await orderLineRepo.save(orderLine);

    // Return the full updated order
    return order;
  }

  //Vendor method to get products on orders
  async vendorOrderLine(userId?: string) {
    const vendorRepo = AppDataSource.getRepository(Vendor);
    const orderLineRepo = AppDataSource.getRepository(OrderLine);

    const vendor = await vendorRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const orderLines = await orderLineRepo
      .createQueryBuilder("orderLine")
      .leftJoinAndSelect("orderLine.product", "product")
      .leftJoinAndSelect("product.images", "images") // Load product images
      .leftJoinAndSelect("orderLine.order", "order")
      .leftJoinAndSelect("order.user", "user") // Include user in the relationship
      .where("orderLine.vendor = :vendorId", { vendorId: vendor?.id })
      .andWhere("order.status NOT IN (:...statuses)", {
        statuses: [OrderStatus.pending, OrderStatus.canceled],
      })
      .getMany();

    if (!orderLines.length) {
      return [];
    }

    // Transform the response to include totalAmount
    return orderLines.map((orderLine) => ({
      id: orderLine.id,
      quantity: orderLine.quantity,
      unitPrice: orderLine.unitPrice,
      totalAmount: orderLine.unitPrice * orderLine.quantity,
      status: orderLine.status,
      product: {
        id: orderLine.product.id,
        name: orderLine.product.name,
        images: orderLine.product.images,
      },
      order: {
        id: orderLine.order.id,
        orderDate: orderLine.order.orderDate,
        user: {
          firstName: orderLine.order.user.firstName,
          lastName: orderLine.order.user.lastName,
        },
      },
    }));
    
  }

  //Admin method to get all orders
  async getAllOrders(
    skip: number,
    take: number,
    productName?: string,
    productDescription?: string,
    vendorId?: string,
    orderDate?: Date
  ) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);

      const queryBuilder = orderRepo
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.orderLines", "orderLine")
        .leftJoinAndSelect("orderLine.product", "product")
        .leftJoinAndSelect("product.vendor", "vendor")
        .leftJoinAndSelect("order.user", "user")
        .leftJoinAndSelect("order.orderAddress", "orderAddress")
        .where("1=1") // Dummy where clause to allow for easy appending of andWhere clauses
        .andWhere("order.status NOT IN (:...statuses)", {
          statuses: [OrderStatus.pending, OrderStatus.canceled],
        });

      if (productName) {
        queryBuilder.andWhere("product.name ILIKE :productName", {
          productName: `%${productName}%`,
        });
      }

      if (productDescription) {
        queryBuilder.andWhere("product.description ILIKE :productDescription", {
          productDescription: `%${productDescription}%`,
        });
      }

      if (vendorId) {
        queryBuilder.andWhere("vendor.id = :vendorId", { vendorId });
      }

      if (orderDate) {
        queryBuilder.andWhere("order.orderDate = :orderDate", { orderDate });
      }

      queryBuilder.skip(skip).take(take);

      const [records, count] = await queryBuilder.getManyAndCount();
      return { records, count };
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw new Error("Error fetching all orders");
    }
  }

  async clearCart(userId?: string) {
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOneBy({
      user: { id: userId },
      status: OrderStatus.pending,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    await orderRepo.delete(order.id);
    return { message: "Order deleted successfully" };
  }

  async markOrderLineDelivered(orderLineId: string) {
    const orderLineRepo = AppDataSource.getRepository(OrderLine);
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const orderLine = await orderLineRepo.findOne({
      where: { id: orderLineId },
      relations: ["product", "product.vendor"],
    });
    if (!orderLine) throw new Error("OrderLine not found");

    const commissionRate = 0.15; // 15%
    const amount = orderLine.unitPrice * orderLine.quantity;
    const commission = parseFloat(amount.toString()) * commissionRate;
    const vendorEarnings = parseFloat(amount.toString()) - commission;

    orderLine.status = OrderLineStatus.delivered;
    orderLine.commission = commission;
    orderLine.vendorEarnings = vendorEarnings;
    await orderLineRepo.save(orderLine);

    const vendorBalanceRepo = AppDataSource.getRepository(VendorBalance);
    let balance = await vendorBalanceRepo.findOne({
      where: { vendor: { id: orderLine.product.vendor.id } },
    });

    if (!balance) {
      balance = vendorBalanceRepo.create({
        vendor: orderLine.product.vendor,
        totalPaid: 0,
        pendingPayout: vendorEarnings,
      });
    } else {
      balance.pendingPayout += vendorEarnings;
    }
    await vendorBalanceRepo.save(balance);

    const vendorTransaction = transactionRepo.create({
      vendor: orderLine.product.vendor,
      amount: vendorEarnings,
      type: TransactionStatus.credit,
      participantType: 'vendor',
      orderLineId: orderLine.id,
    });
    await transactionRepo.save(vendorTransaction);

    const adminTransaction = transactionRepo.create({
      amount: commission,
      type: TransactionStatus.credit,
      participantType: 'admin',
      orderLineId: orderLine.id,
    });
    await transactionRepo.save(adminTransaction);
    
    return orderLine;
  }

  //to be reviewed:
  async updateOrderLineStatus(orderLineId: string, status: OrderLineStatus) {
    const orderLineRepo = AppDataSource.getRepository(OrderLine);
    const orderLine = await orderLineRepo.findOneBy({ id: orderLineId });

    if (!orderLine) {
      throw new Error("Order line not found");
    }

    if (!Object.values(OrderLineStatus).includes(status)) {
      throw new Error("Invalid order line status");
    }

    orderLine.status = status;
    await orderLineRepo.save(orderLine);

    return orderLine;
  }

  async getUserOrderHistory(userId?: string) {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      
      const orders = await orderRepo.find({
        where: { 
          user: { id: userId }
          // Include all orders, including pending ones
        },
        relations: {
          orderLines: {
            product: {
              images: true,
            },
            vendor: true,
          },
          orderAddress: true,
          payment: true
        },
        order: {
          orderDate: "DESC" // Most recent orders first
        }
      });
      
      return orders;
    } catch (error) {
      console.error("Error fetching user order history:", error);
      throw new Error("Error fetching user order history");
    }
  }
}
