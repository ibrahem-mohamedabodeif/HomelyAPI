import { IsOptional, IsString } from 'class-validator';

export class updateFacilityDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
