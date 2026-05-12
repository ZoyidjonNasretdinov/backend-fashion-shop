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
    summary: 'Virtual kiyim sinab ko\'rish (AI) — darhol jobId qaytaradi',
    description: `
**Ishlash tartibi:**
1. Rasmingizni yuklang va productId bering
2. Darhol \`jobId\` qaytariladi (~1 soniya)
3. \`GET /tryon/status/{jobId}\` orqali natijani kuzating
4. \`status: "done"\` bo'lganda \`resultImageUrl\` tayyor

> ⏱️ AI qayta ishlash odatda **1-3 daqiqa** oladi (HuggingFace shared GPU).
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

  @Get('status/:jobId')
  @ApiOperation({
    summary: 'Try-on natijasini tekshirish',
    description: `
**Status qiymatlari:**
- \`processing\` — AI hali ishlayapti
- \`done\` — Tayyor! \`resultImageUrl\` da natija bor
- \`error\` — Xatolik yuz berdi
    `,
  })
  @ApiParam({ name: 'jobId', description: 'startTryOn dan olingan job ID' })
  getStatus(@Param('jobId') jobId: string) {
    return this.tryonService.getJobStatus(jobId);
  }

  @Get('view/:jobId')
  @ApiOperation({ summary: 'Natija rasmini to\'g\'ridan-to\'g\'ri ko\'rish (Redirect)' })
  @ApiParam({ name: 'jobId', description: 'startTryOn dan olingan job ID' })
  async viewImage(@Param('jobId') jobId: string, @Res() res: any) {
    const job = this.tryonService.getJobStatus(jobId);
    if (job.status === 'done' && job.resultImageUrl) {
      return res.redirect(job.resultImageUrl);
    }
    return res.status(202).json({
      message: 'Rasm hali tayyor emas yoki xatolik yuz berdi',
      status: job.status,
      error: job.error,
    });
  }
}
