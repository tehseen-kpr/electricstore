/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

import { Purchase } from './schemas/purchase.schema';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}


  

  // @Post()
  // async createPurchase(@Body() createPurchaseDto: CreatePurchaseDto) {
  //   try {
  //     console.log("✅ Received Data:", createPurchaseDto);
  //     return await this.purchaseService.create(createPurchaseDto);
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       console.error("❌ Purchase creation failed:", error.getResponse());
  //       throw new BadRequestException(error.getResponse());
  //     }
  //     console.error("❌ Unexpected error:", error);
  //     throw new BadRequestException("Invalid request data");
  //   }
  // }
  


  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto):Promise<Purchase> {
    console.log("Received Data:", createPurchaseDto);
    return this.purchaseService.create(createPurchaseDto);
    
  }

  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purchaseService.findOne(id);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseService.delete(id);
  }
}