/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsPositive ,IsNumber, IsString } from 'class-validator';
export class CreatePurchaseDto {
  @IsNotEmpty()
  @IsString()
  product: string; //

  @IsOptional()
  @IsString()
  description: string;

  
  @IsPositive()
  @IsNumber()
  price: number;

  
  @IsPositive()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  total?: number; // Optional, can be calculated automatically
}