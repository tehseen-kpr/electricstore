import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateSaleDto {
  @IsString()
  @IsOptional()
  productId?: string; // ID of the product sold

  @IsNumber()
  @IsOptional()
  quantity?: number; // Quantity of the product sold

  @IsNumber()
  @IsOptional()
  salePrice?: number; // Price at which the product was sold

  @IsDateString()
  @IsOptional()
  saleDate?: string; // Date of the sale in YYYY-MM-DD format
}