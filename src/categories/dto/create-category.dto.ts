import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Erkaklar kiyimlari' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Barcha turdagi erkaklar kiyimlari bo\'limi' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/example.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
