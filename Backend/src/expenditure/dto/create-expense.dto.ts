/* eslint-disable prettier/prettier */
import { IsEnum, IsNumber, IsString, IsDateString } from 'class-validator';
import { ExpenseCategory, TypeOfExpense } from '../schemas/expense.schema';

export class CreateExpenseDto {
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory; // Category of the expense

  @IsString()
  description: string; // Description of the expense

  @IsNumber()
  amount: number; // Amount of the expense

  @IsDateString()
  date: string; // Date of the expense in YYYY-MM-DD format

  @IsEnum(TypeOfExpense)
  typeOfExpense: TypeOfExpense; // Frequency of the expense
}