/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import mongoose from 'mongoose';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // Create a new product (authenticated)
  @Post()
  //@UseGuards(AuthGuard())
  async createProduct(
    @Body() product: CreateProductDto,
    @Req() req,
  ): Promise<Product> {
    return this.productService.create(product, req.user);
  }

  // Get all products
  @Get()
  //@Roles(Role.Manager, Role.Admin)
  //@UseGuards(AuthGuard(), RolesGuard)
  async getAllProducts(@Query() query: ExpressQuery): Promise<Product[]> {
    return this.productService.findAll(query);
  }

  // Get products by id
  @Get(':id')
  async getProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.findById(id);
  }


  @Patch(':id')
async updateProduct(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto
) {
  try {
    return await this.productService.updateById(id, updateProductDto);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw new BadRequestException('Invalid product ID format');
    }
    throw error;
  }
}
  // Update product by id
  /* @Put(':id')
  async updateProduct(
    @Param('id')
    id: string,
    @Body()
    book: CreateProductDto,
  ): Promise<Product> {
    return this.productService.updateById(id, book);
  }
 */
  // Delete product by id
  @Delete(':id')
  async deleteProduct(
    @Param('id')
    id: string,
  ): Promise<{ deleted: boolean }> {
    return this.productService.deleteById(id);
  }
}
