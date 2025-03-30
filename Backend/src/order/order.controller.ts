import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Order } from './schemas/order.schema';
import { DateRangeDto } from './dto/date-Range.dto';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: { user: User },
  ): Promise<Order> {
    return this.orderService.create(createOrderDto, req.user);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  // Get orders within a specific date range
  @Get('by-date-range')
  async getOrdersByDateRange(@Query() dateRangeDto: DateRangeDto): Promise<Order[]> {
    const { startDate, endDate } = dateRangeDto;

    // Validate the date format
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Expected format: YYYY-MM-DD');
    }

    return this.orderService.getOrdersByDateRange(startDate, endDate);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.orderService.delete(id);
  }

  // Update an existing order
  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: CreateOrderDto,
  ) {
    try {
      const updatedOrder = await this.orderService.updateOrder(
        id,
        updateOrderDto,
      );
      return {
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  
}
