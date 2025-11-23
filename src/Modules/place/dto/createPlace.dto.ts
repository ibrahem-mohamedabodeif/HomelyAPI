import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  public title: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  public description: string;

  @IsString()
  @IsNotEmpty({ message: 'placeTypeID is required' })
  public placeTypeID: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ message: 'location is required' })
  @Type(() => Number)
  public location: [number, number];

  @IsString()
  @IsNotEmpty({ message: 'country is required' })
  public country: string;

  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  public city: string;

  @IsString()
  @IsNotEmpty({ message: 'address is required' })
  public address: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'guests number is required' })
  public guests: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'bedrooms number is required' })
  public bedrooms: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'beds number is required' })
  public beds: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'bathrooms number is required' })
  public bathrooms: number;

  @IsArray()
  @IsNotEmpty({ message: 'facilities is required' })
  @IsString({ each: true })
  public facilities: string[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'price per night  is required' })
  public price: number;

  @IsString()
  @IsOptional()
  public hostID?: string;
}
