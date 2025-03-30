import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MonthValidationPipe implements PipeTransform {
  transform(value: any) {
    const [year, month] = value.split('-').map(Number);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      throw new BadRequestException('Invalid date format. Expected format: YYYY-MM or YYYY-M with a valid month (1-12)');
    }

    return value;
  }
}