import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { User } from '../../auth/schemas/user.schema';

@Schema({
  timestamps: true,
  collection: 'sales',
})
export class Sale extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  productId: Product; // Reference to the product sold

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  soldBy: User; // Reference to the user who recorded the sale

  @Prop({ required: true })
  quantity: number; // Quantity of the product sold

  @Prop({ required: true })
  salePrice: number; // Price at which the product was sold

  @Prop({ required: true, type: Date })
  saleDate: Date; // Date of the sale

  @Prop({ required: true })
  totalAmount: number; // Total amount of the sale (quantity * salePrice)
}

export const SaleSchema = SchemaFactory.createForClass(Sale);