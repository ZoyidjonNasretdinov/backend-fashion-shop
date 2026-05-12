import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Ali Karimov', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'NewPassword456' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
