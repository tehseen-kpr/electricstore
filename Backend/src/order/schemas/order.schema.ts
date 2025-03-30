/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { User } from '../../auth/schemas/user.schema';

@Schema({
  timestamps: true,
  collection: 'orders',
})
export class Order extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User; // Reference to the customer who placed the order

  @Prop({ required: true })
  customerName: string; // Name of the customer

  @Prop({ required: true })
  customerPhone: number; // Phone number of the customer (Pakistani format)

  @Prop([
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the product
      productName: { type: String, required: true }, // Name of the product
      price: { type: Number, required: true }, // Price of the product
      quantity: { type: Number, required: true }, // Quantity of the product
      //date: { type: Date, default: Date.now }, // Date of the order
    },
  ])
  products: {
    product: Product;
    productName: string;
    price: number;
    quantity: number;
    //date: Date;
  }[];

  @Prop({ required: true })
  totalBeforeDiscount: number; // Total amount before discount

  @Prop({ required: true })
  discountPercentage: number; // Discount percentage (e.g., 5% to 10%)

  @Prop({ required: true })
  discountAmount: number; // Discount amount

  @Prop({ required: true })
  totalAmount: number; // Total amount after discount

  @Prop({ required: true, type: Date })
  orderDate: Date; // Date of the order
}

export const OrderSchema = SchemaFactory.createForClass(Order);