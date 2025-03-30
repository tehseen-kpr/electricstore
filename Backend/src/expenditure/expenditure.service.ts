/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Expense } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

// async create(createExpenseDto: CreateExpenseDto, user: any): Promise<Expense> {
//     try {
//       const res = await this.expenseModel.create(createExpenseDto);
//       return res;
//     } catch (error) {
//       console.error('Error during expense creation:', error); // Log the error
//       if (error.cause?.code === 11000 || error.code === 11000) {
//         throw new ConflictException('Duplicate expense Name');
//       }
//       throw new Error('expense creation failed');
//     }
//   }



  // Create a new expense
  async create(
    createExpenseDto: CreateExpenseDto,
    user: User,
  ): Promise<Expense> {
    const expense = new this.expenseModel({
      ...createExpenseDto,
      recordedBy: user, // Associate the expense with the user who recorded it
    });
    return expense.save();
  }

  // Get all expenses
  async findAll(): Promise<Expense[]> {
    //return this.expenseModel.find().populate('recordedBy').exec();
    return this.expenseModel.find().exec();
  }

  // Get expenses by category
  async findByCategory(category: string): Promise<Expense[]> {
    console.log('Querying category:', category); // Debugging
    const categoryfind = await this.expenseModel
      .find({ category })
      .populate('recordedBy')
      .exec();

    if (categoryfind.length === 0) {
      throw new NotFoundException(
        `No expenses found for category: ${category}`,
      );
    }
    return categoryfind;
  }

  // Get a single expense by ID
  async findById(id: string): Promise<Expense> {
    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }

    const expense = await this.expenseModel.findById(id).exec();

    // Check if the expense was found
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  // Update an expense by ID

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
     // Check if the ID is a valid MongoDB ObjectId
     if (!isValidObjectId(id)) {
        throw new NotFoundException(`Invalid ID format: ${id}`);
      }
    const updatedExpense = await this.expenseModel
      .findByIdAndUpdate(id, updateExpenseDto, { new: true })
      .exec();
    if (!updatedExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return updatedExpense;
  }
  
 /*  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
     // Check if the ID is a valid MongoDB ObjectId
     if (!isValidObjectId(id)) {
        throw new NotFoundException(`Invalid ID format: ${id}`);
      }
    const updatedExpense = await this.expenseModel
      .findByIdAndUpdate(id, updateExpenseDto, { new: true })
      .populate('recordedBy')
      .exec();
    if (!updatedExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return updatedExpense;
  } */

  // Delete an expense by ID
  async delete(id: string): Promise<{ deleted: boolean }> {
    const res = await this.expenseModel.findByIdAndDelete(id);
    if (!res) {
      return { deleted: false };
    }
    return { deleted: true };
  }

  // Get total expenses for a specific period
  async getTotalExpenses(startDate: string, endDate: string): Promise<{ total: number; expenses: Expense[] }> {
    // Convert the date strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Validate the dates
    if (isNaN(start.getTime())) {
      throw new BadRequestException('Invalid startDate');
    }
    if (isNaN(end.getTime())) {
      throw new BadRequestException('Invalid endDate');
    }
  
    // Query the database for expenses within the date range
    const expenses = await this.expenseModel
      .find({
        date: { $gte: start, $lte: end },
      })
      .exec();
  
    // Calculate the total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
    // Return the total and the list of expenses
    return { total, expenses };
  }
}
