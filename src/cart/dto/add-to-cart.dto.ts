import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '65b2a...' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'L', required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ example: 'Qora', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}
