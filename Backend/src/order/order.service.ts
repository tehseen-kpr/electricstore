import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../auth/schemas/user.schema';
import { ProductService } from '../product/product.service';
import { validateOrReject } from 'class-validator';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productService: ProductService, // Inject ProductService to update product quantities
  ) {}

  // Create a new order
  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    // Validate the DTO
    await validateOrReject(createOrderDto);

    // Set default value for orderDate if not provided
    const orderDate = createOrderDto.orderDate
      ? new Date(createOrderDto.orderDate)
      : new Date();
    if (isNaN(orderDate.getTime())) {
      throw new BadRequestException(
        'Invalid order date format. Expected format: YYYY-MM-DD',
      );
    }

    // Convert product IDs to ObjectId
    const productsWithObjectIds = createOrderDto.products.map((item) => ({
      product: new mongoose.Types.ObjectId(item.productId), // Convert to ObjectId
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
    }));

    // Calculate the total amount before discount
    const totalBeforeDiscount = createOrderDto.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Calculate the discount amount
    const discountAmount =
      (totalBeforeDiscount * createOrderDto.discountPercentage) / 100;

    // Calculate the total amount after discount
    const totalAmount = totalBeforeDiscount - discountAmount;

    // Create the order object
    const order = new this.orderModel({
      ...createOrderDto,
      user: user._id, // Associate the order with the user
      products: productsWithObjectIds, // Use the converted products array
      totalBeforeDiscount,
      discountAmount,
      totalAmount,
      orderDate,
    });

    // Update product quantities
    for (const item of createOrderDto.products) {
      await this.productService.decreaseQuantity(item.productId, item.quantity); // Reduce product quantity
    }

    // Save the order to the database
    return order.save();
  }

  // Get all orders
  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('user')
      .populate('products.product')
      .exec();
  }

  // Get a single order by ID
  async findById(id: string): Promise<Order> {
    // if (!mongoose.isValidObjectId(id)) {
    //   throw new BadRequestException('Invalid ID format');
    // }

    const order = await this.orderModel
      .findById(id)
      .populate('user')
      .populate('products.product')
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Delete an order by ID
  async delete(id: string): Promise<{ deleted: boolean }> {
    // if (!mongoose.isValidObjectId(id)) {
    //   throw new BadRequestException('Invalid ID format');
    // }

    const order = await this.orderModel.findByIdAndDelete(id).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { deleted: true };
  }

  // Update an order by ID
  async updateOrder(
    id: string,
    updateOrderDto: CreateOrderDto,
  ): Promise<Order> {
    // Validate the ID
    // if (!mongoose.isValidObjectId(id)) {
    //   throw new BadRequestException('Invalid ID format');
    // }

    // Validate the DTO
    await validateOrReject(updateOrderDto);

    // Find the existing order
    const existingOrder = await this.orderModel.findById(id).exec();
    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // Convert product IDs to ObjectId
    const productsWithObjectIds = updateOrderDto.products.map((item) => ({
      product: new mongoose.Types.ObjectId(item.productId), // Convert to ObjectId
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
    }));

    // Calculate the total amount before discount
    const totalBeforeDiscount = updateOrderDto.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Calculate the discount amount
    const discountAmount =
      (totalBeforeDiscount * updateOrderDto.discountPercentage) / 100;

    // Calculate the total amount after discount
    const totalAmount = totalBeforeDiscount - discountAmount;

    // Update the order object
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        ...updateOrderDto,
        products: productsWithObjectIds,
        totalBeforeDiscount,
        discountAmount,
        totalAmount,
      },
      { new: true }, // Return the updated document
    );

    if (!updatedOrder) {
      throw new NotFoundException('Order not found after update attempt');
    }

    // Update product quantities in the inventory
    for (const item of updateOrderDto.products) {
      const existingProduct = existingOrder.products.find(
        (p) => p.product.toString() === item.productId,
      );

      if (existingProduct) {
        // Calculate the difference in quantity
        const quantityDifference = item.quantity - existingProduct.quantity;

        if (quantityDifference < 0) {
          // If the quantity is decreased, increase the inventory (add back the surplus)
          await this.productService.increaseQuantity(
            item.productId,
            Math.abs(quantityDifference),
          );
        } else if (quantityDifference > 0) {
          // If the quantity is increased, decrease the inventory
          await this.productService.decreaseQuantity(
            item.productId,
            quantityDifference,
          );
        }
        // If quantityDifference === 0, no change is needed
      } else {
        // If it's a new product, decrease the quantity
        await this.productService.decreaseQuantity(
          item.productId,
          item.quantity,
        );
      }
    }

    return updatedOrder;
  }

  // Get orders by date range
  async getOrdersByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Order[]> {
    // Validate the date format
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Expected format: YYYY-MM-DD',
      );
    }

    // Fetch orders within the date range
    const orders = await this.orderModel
      .find({
        orderDate: {
          $gte: start, // Greater than or equal to startDate
          $lte: end, // Less than or equal to endDate
        },
      })
      .populate('user')
      .populate('products.product')
      .exec();

    return orders;
  }
}
