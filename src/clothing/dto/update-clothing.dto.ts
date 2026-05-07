import { PartialType } from '@nestjs/swagger';
import { CreateClothingDto } from './create-clothing.dto';

export class UpdateClothingDto extends PartialType(CreateClothingDto) {}
