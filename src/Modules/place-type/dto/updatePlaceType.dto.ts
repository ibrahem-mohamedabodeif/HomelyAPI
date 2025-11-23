import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceTypeDto } from './createPlaceType.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdatePlaceTypeDto extends PartialType<CreatePlaceTypeDto>(
  CreatePlaceTypeDto,
) {}
