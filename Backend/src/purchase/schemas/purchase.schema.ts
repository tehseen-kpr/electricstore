/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
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
export class Purchase extends Document {
  @Prop({ required: true }) 
  product: string; 

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  total:number;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);