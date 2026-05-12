import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { OrderStatus } from './schemas/order.schema';

@ApiTags('📦 Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buyurtma berish' })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.create(createOrderDto, req.user.sub);
  }

  @Get('my-orders')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Foydalanuvchining o\'z buyurtmalarini ko\'rishi' })
  findMyOrders(@Request() req: any) {
    return this.ordersService.findByUser(req.user.sub);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Barcha buyurtmalarni ko\'rish (Faqat ADMIN)' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id/status')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buyurtma holatini o\'zgartirish (Faqat ADMIN)' })
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/confirm')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Buyurtmani tasdiqlash (SELLER/ADMIN)' })
  confirmOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.CONFIRMED);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buyurtmani bekor qilish' })
  cancelOrder(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.cancelOrder(id, req.user.sub, req.user.role);
  }
}
