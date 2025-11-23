import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlaceTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'Type is required' })
  type: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
