import {
  Controller, Post, Get, Param, UseGuards, UseInterceptors,
  UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TryonService } from './tryon.service';

@ApiTags('👗 Virtual Try-On')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tryon')
export class TryonController {
  constructor(private readonly tryonService: TryonService) {}

  @Post(':productId')
  @ApiOperation({
    summary: 'Virtual kiyim sinab ko\'rish (AI) — tayyor rasm URL manzilini qaytaradi',
    description: `
**Ishlash tartibi:**
1. Rasmingizni yuklang va productId bering
2. AI rasmni qayta ishlaydi va kiyimni kiyintiradi
3. Tayyor rasm URL manzilini darhol qaytaradi (Sinxron)
    `,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Sizning rasmingiz (to\'liq badan)' },
      },
    },
  })
  @ApiParam({ name: 'productId', description: 'Sinab ko\'riladigan kiyim ID si' })
  @UseInterceptors(FileInterceptor('file'))
  startTryOn(
    @Param('productId') productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.tryonService.startTryOn(productId, file);
  }
}
