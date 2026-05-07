import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClothingService } from './clothing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';

@ApiTags('👗 Clothing')
@Controller('clothing')
export class ClothingController {
  constructor(private readonly clothingService: ClothingService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Yangi kiyim qo\'shish (Faqat SELLER yoki ADMIN)' })
  create(@Body() createDto: CreateClothingDto, @Request() req: any) {
    return this.clothingService.create(createDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha faol kiyimlarni ko\'rish' })
  findAll() {
    return this.clothingService.findAll();
  }

  @Get('my-products')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchining o\'z mahsulotlarini ko\'rishi' })
  findMyProducts(@Request() req: any) {
    return this.clothingService.findBySeller(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta kiyim haqida batafsil ma\'lumot' })
  findOne(@Param('id') id: string) {
    return this.clothingService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Kiyim ma\'lumotlarini yangilash' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClothingDto,
    @Request() req: any,
  ) {
    return this.clothingService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Kiyimni o\'chirish' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.clothingService.remove(id, req.user.sub);
  }
}
