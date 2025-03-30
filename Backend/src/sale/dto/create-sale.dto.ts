import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  productId: string; // ID of the product sold

  @IsNumber()
  quantity: number; // Quantity of the product sold

  @IsNumber()
  salePrice: number; // Price at which the product was sold

  @IsDateString()
  saleDate: string; // Date of the sale in YYYY-MM-DD format
}