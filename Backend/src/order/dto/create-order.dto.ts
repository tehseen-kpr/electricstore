import {
  IsArray,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  Max,
  ValidateNested,
  Matches,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId: string; // ID of the product

  @IsString()
  productName: string; // Name of the product

  @IsNumber()
  price: number; // Price of the product

  @IsNumber()
  quantity: number; // Quantity of the product
}

export class CreateOrderDto {
  @IsString()
  customerName: string; // Name of the customer

  @IsString()
  @Matches(/^03\d{9}$/, {
    message:
      'Phone number must be a valid Pakistani cell phone number (e.g., 03077613801)',
  })
  customerPhone: number; // Phone number of the customer (Pakistani format)

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  products: OrderItemDto[]; // Array of products in the order

  @IsNumber()
  @Min(5) // Minimum discount percentage
  @Max(10) // Maximum discount percentage
  discountPercentage: number; // Discount percentage (5% to 10%)

  @IsDateString()
  @IsOptional()
  orderDate: string ; // Date of the order in YYYY-MM-DD format
}
