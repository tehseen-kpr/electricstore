/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { isValidObjectId } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: mongoose.Model<Product>,
    // @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto, user: any): Promise<Product> {
    try {
      const res = await this.productModel.create(createProductDto);
      return res;
    } catch (error) {
      console.error('Error during product creation:', error); // Log the error
      if (error.cause?.code === 11000 || error.code === 11000) {
        throw new ConflictException('Duplicate product Name');
      }
      throw new Error('product creation failed');
    }
  }


  /* 
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel({
      ...createProductDto,
      createdAt: new Date()
    });
    return createdProduct.save();
  }

  */

  // Get all products
  async findAll(query: Query): Promise<Product[]> {
    console.log('query:', query.keyword);

    // Define the fields you want to search in
    const searchFields = ['name', 'description']; // Add or remove fields as needed

    // Construct the $or query if a keyword is provided
    const keyword = query.keyword
      ? {
          $or: searchFields.map((field) => ({
            [field]: {
              $regex: query.keyword,
              $options: 'i', // Case-insensitive search
            },
          })),
        }
      : {};

    console.log('keyword:', keyword); // Log the keyword object

    const products = await this.productModel.find({ ...keyword });
    console.log('products:', products);
    if (products.length === 0) {
      throw new NotFoundException(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `No Products found for keyword: ${query.keyword}`,
      );
    }
    return products;
  }
  // Get products by id
  async findById(id: string): Promise<Product> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }


  // product.service.ts
async updateById(id: string, updateData: Partial<Product>): Promise<Product> {
  // Validate ID format
  if (!isValidObjectId(id)) {
    throw new BadRequestException(`Invalid ID format: ${id}`);
  }

  // Check if product exists first
  const exists = await this.productModel.exists({ _id: id });
  if (!exists) {
    throw new NotFoundException('Product not found');
  }

  try {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found after update attempt');
    }

    return updatedProduct;
  } catch (error) {
    console.error('Update error:', error);
    if (error.code === 11000) {
      throw new ConflictException('Duplicate product name');
    }
    if (error.name === 'ValidationError') {
      throw new BadRequestException(error.message);
    }
    throw new InternalServerErrorException('Failed to update product');
  }
}

//sajjad service
  /* async updateById(id: string, product: Product): Promise<Product> {
    // Validate the ID format
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
  
    // Find the product by ID
    const existingProduct = await this.productModel.findById(id).exec();
  
    // Check if the product exists
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
  
    // Update the product fields
    Object.assign(existingProduct, product);
  
    try {
      // Save the updated product
      const updatedProduct = await existingProduct.save();
      return updatedProduct;
    } catch (error) {
      console.error('Error during product update:', error); // Log the error
      // Handle duplicate key errors
      if (error.code === 11000 || error.cause?.code === 11000) {
        throw new ConflictException('Duplicate product name');
      }
  
      // Handle other errors
      throw new InternalServerErrorException('Product update failed');
    }
  } */


  /* 
  
  async update(id: string, updateProductDto: CreateProductDto): Promise<Product> {
  const updated = await this.productModel.findByIdAndUpdate(
    id,
    updateProductDto,
    { new: true } // Return updated document
  ).orFail(new NotFoundException(`Product not found`));
  
  return updated.toJSON();
}
  */
  // Delete product by id
  /* async deleteById(id: string): Promise<{ deleted: boolean }> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    await this.productModel.findByIdAndDelete(id);
    return { deleted: true };
  } */

    // product.service.ts (Backend)
async deleteById(id: string): Promise<{ deleted: boolean }> {
  // Validate ID format first
  if (!isValidObjectId(id)) {
    throw new BadRequestException(`Invalid ID format: ${id}`); // Changed from NotFound to BadRequest
  }

  const result = await this.productModel.findByIdAndDelete(id).exec();

  if (!result) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  return { deleted: true };
}


  // Decrease the product quantity
  async decreaseQuantity(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    if (product.quantity < quantity) {
      throw new BadRequestException('Insufficient product quantity');
    }
  
    // Decrease the product quantity
    product.quantity -= quantity;
  
    // Save the updated product
    return product.save();
  }
  
  // Increase the product quantity
  async increaseQuantity(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    // Increase the product quantity
    product.quantity += quantity;
  
    // Save the updated product
    return product.save();
  }
}
