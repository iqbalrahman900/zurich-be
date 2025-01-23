import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productCode: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productDescription: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string;
  
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;
  }