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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yangi kiyim qo\'shish (Faqat SELLER yoki ADMIN)' })
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() createDto: CreateClothingDto,
    @Request() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.clothingService.create(createDto, req.user.sub, files);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha faol kiyimlarni ko\'rish' })
  findAll() {
    return this.clothingService.findAll();
  }

  @Get('landing')
  @ApiOperation({ summary: 'Landing page uchun tasodifiy kiyimlar' })
  getLanding() {
    return this.clothingService.getLandingProducts();
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
