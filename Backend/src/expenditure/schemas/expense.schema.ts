/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import mongoose, { Document } from 'mongoose';
import  { Document } from 'mongoose';

export enum ExpenseCategory {
  RENT = 'rent',
  ELECTRICITY = 'electricity',
  SALARIES = 'salaries',
  MAINTENANCE = 'maintenance',
  OTHER = 'other',
}

export enum TypeOfExpense {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
  OTHER = 'other',
}

@Schema({
  // timestamps: true,
  // collection: 'expenses',
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
export class Expense extends Document {
  @Prop({ required: true, enum: ExpenseCategory })
  category: ExpenseCategory; // Category of the expense

  @Prop({ required: true })
  description: string; // Description of the expense

  @Prop({ required: true })
  amount: number; // Amount of the expense

  @Prop({ required: true, type: Date ,default: Date.now})
  date: Date; // Date of the expense

  @Prop({ required: true, enum: TypeOfExpense })
  typeOfExpense: TypeOfExpense; // Type of the expense (weekly or monthly)

  //  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  //  recordedBy: mongoose.Types.ObjectId; // User who recorded the expense
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);