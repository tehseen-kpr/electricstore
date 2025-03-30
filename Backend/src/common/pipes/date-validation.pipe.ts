import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: any) {
    // Check if the value matches the expected date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{1,2}$/;
    if (!dateRegex.test(value)) {
      throw new BadRequestException('Invalid date format. Expected format: YYYY-MM-DD');
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Expected format: key=YYYY-MM-DD');
    }

    return value;
  }
}