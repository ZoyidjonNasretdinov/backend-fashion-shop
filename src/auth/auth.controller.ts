import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('🔓 Tizimga kirish (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchini ro\'yxatdan o\'tkazish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Eshmatov Toshmat' },
        email: { type: 'string', example: 'toshmat@gmail.com' },
        password: { type: 'string', example: 'parol123' },
        role: { type: 'string', example: 'USER', enum: ['USER', 'ADMIN', 'SELLER'] },
      },
    },
  })
  @ApiResponse({ status: 201, description: '🎉 Muvaffaqiyatli ro\'yxatdan o\'tdingiz' })
  @ApiResponse({ status: 409, description: '🚫 Bu email avval band qilingan' })
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish (Login)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'toshmat@gmail.com' },
        password: { type: 'string', example: 'parol123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '✅ Token va user ma\'lumotlari beriladi' })
  @ApiResponse({ status: 401, description: '🔐 Email yoki parol xato' })
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
