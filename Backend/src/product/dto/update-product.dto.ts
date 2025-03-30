/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsNumber()
  @Min(0)
  readonly quantity: number;

  @IsNumber()
  @IsOptional()
  readonly watts: number;
}