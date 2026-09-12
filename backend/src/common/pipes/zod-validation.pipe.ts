import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value);

    if (result.success) {
      return result.data;
    }

    throw new BadRequestException(
      result.error.issues.map((issue) => {
        const field = issue.path.join('.') || 'body';
        return `${field}: ${issue.message}`;
      }),
    );
  }
}
