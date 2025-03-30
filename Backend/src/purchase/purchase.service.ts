/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Model, Schema as MongooseSchema } from 'mongoose';
import { Model } from 'mongoose';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase } from './schemas/purchase.schema';

@Injectable()
export class PurchaseService {
  constructor(@InjectModel(Purchase.name) private purchaseModel: Model<Purchase>) {}

  async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    
  //   const createdPurchase = new this.purchaseModel({
  //     ...createPurchaseDto,
  //     product: new MongooseSchema.Types.ObjectId(createPurchaseDto.product),
  //     createdAt: new Date()
  //   });
  //   return createdPurchase.save();
  // }

  const createdPurchase = new this.purchaseModel({
    ...createPurchaseDto,
    createdAt: new Date()
  });
  return createdPurchase.save();
}


  // async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    
  //   const createdPurchase = new this.purchaseModel({
  //     ...createPurchaseDto,
      
  //     createdAt: new Date()
  //   });
  //   return createdPurchase.save();
  // }

  async findAll(): Promise<Purchase[]> {
     return this.purchaseModel.find().exec();
    
  }

  // async getPurchases() {
  //   return this.purchaseModel.find().populate('product', 'id name').exec();
  // }

  async update(id: string, updatePurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    const updatedPurchase = await this.purchaseModel.findByIdAndUpdate(id, updatePurchaseDto, { new: true }).exec();
    if (!updatedPurchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return updatedPurchase;
  }

  async delete(id: string): Promise<Purchase> {
    const deletedPurchase = await this.purchaseModel.findByIdAndDelete(id).exec();
    if (!deletedPurchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return deletedPurchase;
  }
}