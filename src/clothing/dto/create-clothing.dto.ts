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

  @ApiProperty({ example: '65b2a...', description: 'Kategoriya IDsi' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Kiyim rasmlari (bir nechta)',
  })
  images: any[];

  @ApiProperty({ example: 10, description: 'Chegirma foizi', required: false })
  @IsNumber()
  @IsOptional()
  discount?: number;
}
