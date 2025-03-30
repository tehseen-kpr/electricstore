import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { SaleService } from './sale.service';
  import { CreateSaleDto } from './dto/create-sale.dto';
  import { UpdateSaleDto } from './dto/update-sale.dto';
  import { AuthGuard } from '@nestjs/passport';
  import { User } from '../auth/schemas/user.schema';
import { Sale } from './schema/sale.schema';
  
  @Controller('sales')
  export class SaleController {
    constructor(private salesService: SaleService) {}
  
    @Post()
    @UseGuards(AuthGuard())
    async create(
      @Body() createSaleDto: CreateSaleDto,
      @Req() req: { user: User },
    ): Promise<Sale> {
      return this.salesService.create(createSaleDto, req.user);
    }
  
    @Get()
    async findAll(): Promise<Sale[]> {
      return this.salesService.findAll();
    }
  
    @Get(':id')
    async findById(@Param('id') id: string): Promise<Sale> {
      return this.salesService.findById(id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateSaleDto: UpdateSaleDto,
    ): Promise<Sale> {
      return this.salesService.update(id, updateSaleDto);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
      return this.salesService.delete(id);
    }
  
    @Get('total')
    async getTotalSales(
      @Query('startDate') startDate: string,
      @Query('endDate') endDate: string,
    ): Promise<number> {
      return this.salesService.getTotalSales(startDate, endDate);
    }
  
    @Get('last-week')
    async getLastWeekSales(): Promise<Sale[]> {
      return this.salesService.getLastWeekSales();
    }
  
    @Get('last-month')
    async getLastMonthSales(): Promise<Sale[]> {
      return this.salesService.getLastMonthSales();
    }
  }