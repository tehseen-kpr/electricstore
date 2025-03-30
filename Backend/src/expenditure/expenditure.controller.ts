/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  //NotFoundException,
  Param,
  Patch,
  Post,
  //Put,
  Query,
  Req,
  //UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expenditure.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
// import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Expense } from './schemas/expense.schema';

@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post()
  // @UseGuards(AuthGuard())
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: { user: User },
  ): Promise<Expense> {
    return this.expenseService.create(createExpenseDto, req.user);
  }

  @Get()
  async findAll(): Promise<Expense[]> {
    return this.expenseService.findAll();
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string,
  ): Promise<Expense[]> {
    return this.expenseService.findByCategory(category);
  }

  @Get('total')
  async getTotalExpenses(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{total: number; expenses: Expense[] }> {
    return this.expenseService.getTotalExpenses(startDate, endDate);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Expense> {
    return await this.expenseService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.expenseService.delete(id);
  }
}
