import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createFacilityDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
