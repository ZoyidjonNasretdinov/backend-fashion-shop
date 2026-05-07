import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateClothingDto {
  @ApiProperty({ example: 'Erkaklar ko\'ylagi', description: 'Kiyim nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'XL', description: 'Kiyim o\'lchami' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 'Qora', description: 'Kiyim rangi' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 250000, description: 'Kiyim narxi' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'Sifatli paxtadan tayyorlangan', description: 'Kiyim haqida batafsil' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Kiyim rasmi URL' })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;
}
