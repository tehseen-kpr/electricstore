/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({
  // timestamps: true,
  // collection: 'products',

  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      ret.id = doc._id.toString();
      return ret;
    }
  }
})
export class Product extends Document {
  @Prop({ required: true , unique: [true, 'Duplicate name entered']})
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  watts: number;

}

export const ProductSchema = SchemaFactory.createForClass(Product);