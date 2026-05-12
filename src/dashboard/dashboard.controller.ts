import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { DashboardService } from './dashboard.service';

@ApiTags('📊 Dashboardlar')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin Dashboard (Faqat ADMIN kirishi mumkin)' })
  @ApiResponse({ status: 200, description: 'Admin paneli ma\'lumotlari' })
  @ApiResponse({ status: 403, description: 'Forbidden - Ruxsat yo\'q' })
  async getAdminDashboard(@Request() req: any) {
    const stats = await this.dashboardService.getAdminStats();
    return {
      success: true,
      role: req.user.role,
      message: 'Xush kelibsiz Admin!',
      data: stats,
    };
  }

  @Get('seller')
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchi Dashboard (Faqat SELLER kirishi mumkin)' })
  async getSellerDashboard(@Request() req: any) {
    const stats = await this.dashboardService.getSellerStats(req.user.sub);
    return {
      success: true,
      role: req.user.role,
      message: 'Xush kelibsiz Sotuvchi!',
      data: stats,
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
