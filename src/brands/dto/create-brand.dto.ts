import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Gucci' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Luxury Italian fashion brand' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://logo.com/gucci.png', required: false })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
