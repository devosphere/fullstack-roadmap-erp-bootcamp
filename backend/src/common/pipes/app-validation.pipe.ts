import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

type ZodDtoMetatype = {
  isZodDto?: boolean;
};

export class AppValidationPipe extends ValidationPipe {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const metatype = metadata.metatype as ZodDtoMetatype | undefined;

    // Zod DTOs are validated by the route-level ZodValidationPipe.
    if (metatype?.isZodDto) {
      return value;
    }

    return (await super.transform(value, metadata)) as unknown;
  }
}
