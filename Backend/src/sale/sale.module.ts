import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { Sale, SaleSchema } from './schema/sale.schema';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    ProductModule, // Import ProductModule to reference Product schema
    AuthModule, // Import AuthModule to reference User schema
     PassportModule.register({ defaultStrategy: 'jwt' }), // Register PassportModule with JWT strategy
  ],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}