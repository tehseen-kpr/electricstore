import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import mongoose, { Model } from 'mongoose';
  import { Sale } from './schema/sale.schema';
  import { CreateSaleDto } from './dto/create-sale.dto';
  import { UpdateSaleDto } from './dto/update-sale.dto';
  import { User } from '../auth/schemas/user.schema';
  
  @Injectable()
  export class SaleService {
    constructor(@InjectModel(Sale.name) private saleModel: Model<Sale>) {}
  
    // Create a new sale
    async create(createSaleDto: CreateSaleDto, user: User): Promise<Sale> {
        
      const sale = new this.saleModel({
        ...createSaleDto,
        soldBy: user._id, // Associate the sale with the user who recorded it
        totalAmount: createSaleDto.quantity * createSaleDto.salePrice, // Calculate total amount
      });
      return sale.save();
    }
  
    // Get all sales
    async findAll(): Promise<Sale[]> {
      return this.saleModel.find().populate('product').populate('soldBy').exec();
    }
  
    // Get a single sale by ID
    async findById(id: string): Promise<Sale> {
      if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format');
      }
  
      const sale = await this.saleModel
        .findById(id)
        .populate('product')
        .populate('soldBy')
        .exec();
  
      if (!sale) {
        throw new NotFoundException('Sale not found');
      }
  
      return sale;
    }
  
    // Update a sale by ID
    async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
      if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format');
      }
  
      const sale = await this.saleModel
        .findByIdAndUpdate(
          id,
          {
            ...updateSaleDto,
            totalAmount: (updateSaleDto.quantity ?? 0) * (updateSaleDto.salePrice ?? 0), // Recalculate total amount
          },
          { new: true },
        )
        .populate('product')
        .populate('soldBy')
        .exec();
  
      if (!sale) {
        throw new NotFoundException('Sale not found');
      }
  
      return sale;
    }
  
    // Delete a sale by ID
    async delete(id: string): Promise<{ deleted: boolean }> {
      if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format');
      }
  
      const sale = await this.saleModel.findByIdAndDelete(id).exec();
  
      if (!sale) {
        throw new NotFoundException('Sale not found');
      }
  
      return { deleted: true };
    }
  
    // Get total sales for a specific period
    async getTotalSales(startDate: string, endDate: string): Promise<number> {
      const sales = await this.saleModel
        .find({
          saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        })
        .exec();
  
      return sales.reduce((total, sale) => total + sale.totalAmount, 0);
    }
  
    // Get sales for the last week
    async getLastWeekSales(): Promise<Sale[]> {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
  
      return this.saleModel
        .find({
          saleDate: { $gte: startDate, $lte: endDate },
        })
        .populate('product')
        .populate('soldBy')
        .exec();
    }
  
    // Get sales for the last month
    async getLastMonthSales(): Promise<Sale[]> {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
  
      return this.saleModel
        .find({
          saleDate: { $gte: startDate, $lte: endDate },
        })
        .populate('product')
        .populate('soldBy')
        .exec();
    }
  }