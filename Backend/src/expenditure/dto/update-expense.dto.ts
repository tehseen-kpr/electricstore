/* eslint-disable prettier/prettier */
import { IsEnum, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { ExpenseCategory, TypeOfExpense } from '../schemas/expense.schema';

export class UpdateExpenseDto {
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory; // Category of the expense

  @IsString()
  @IsOptional()
  description?: string; // Description of the expense

  @IsNumber()
  @IsOptional()
  amount?: number; // Amount of the expense

  @IsDateString()
  @IsOptional()
  date?: string; // Date of the expense in YYYY-MM-DD format

  // @IsEnum({ required: true, enum:TypeOfExpense })
  @IsEnum(TypeOfExpense)
  @IsOptional()
  typeOfExpense?: TypeOfExpense; // Type of the expense (weekly or monthly)
  // @IsString()
  // @IsOptional()
  // typeOfExpense?: 'weekly' | 'monthly'; // Frequency of the expense
}