import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('📊 Dashboardlar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin Dashboard (Faqat ADMIN kirishi mumkin)' })
  @ApiResponse({ status: 200, description: 'Admin paneli ma\'lumotlari' })
  @ApiResponse({ status: 403, description: 'Forbidden - Ruxsat yo\'q' })
  getAdminDashboard(@Request() req: any) {
    return {
      success: true,
      role: req.user.role,
      message: 'Xush kelibsiz Admin! Bu sizning maxfiy dodingalaringiz :)',
      data: {
        totalUsers: 156,
        sales: 5000000,
      }
    };
  }

  @Get('seller')
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchi Dashboard (Faqat SELLER kirishi mumkin)' })
  getSellerDashboard(@Request() req: any) {
    return {
      success: true,
      role: req.user.role,
      message: 'Xush kelibsiz Sotuvchi! Bu yerdan o\'z tovarlaringizni qo\'shasiz.',
      data: {
        myProducts: 24,
        mySales: 150000,
      }
    };
  }

  @Get('user')
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Foydalanuvchi Dashboard (Barcha ro\'yxatdan o\'tganlar kira oladi)' })
  getUserDashboard(@Request() req: any) {
    return {
      success: true,
      role: req.user.role,
      message: 'Xush kelibsiz! Bu sizning shaxsiy kabinetingiz.',
    };
  }
}
