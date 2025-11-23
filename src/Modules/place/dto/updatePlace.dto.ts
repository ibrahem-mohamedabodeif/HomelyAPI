import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePlaceDto {
  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public placeTypeID?: string;

  @IsArray()
  @IsOptional()
  public location?: [number, number];

  @IsString()
  @IsOptional()
  public country?: string;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsOptional()
  public address?: string;

  @IsNumber()
  @IsOptional()
  public guests?: number;

  @IsNumber()
  @IsOptional()
  public bedrooms?: number;

  @IsNumber()
  @IsOptional()
  public beds?: number;

  @IsNumber()
  @IsOptional()
  public bathrooms?: number;

  @IsArray()
  @IsOptional()
  public facilities?: string[];

  @IsNumber()
  @IsOptional()
  public price?: number;

  @IsArray()
  @IsOptional()
  public photos?: { url: string; public_id: string }[];

  @IsNotEmpty({ message: 'hostID is required' })
  public hostID: string;
}
