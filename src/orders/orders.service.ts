import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Clothing } from '../clothing/schemas/clothing.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    let totalAmount = 0;
    const itemsWithPrice: { productId: string; quantity: number; price: number }[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.clothingModel.findById(item.productId);
      if (!product || !product.isActive) {
        throw new NotFoundException(`Mahsulot topilmadi: ${item.productId}`);
      }

      const price = product.price * (1 - product.discount / 100);
      totalAmount += price * item.quantity;

      itemsWithPrice.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      });
    }

    const newOrder = new this.orderModel({
      userId,
      items: itemsWithPrice,
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
    });

    return await newOrder.save();
  }

  async findByUser(userId: string) {
    return await this.orderModel.find({ userId }).populate('items.productId').exec();
  }

  async findAll() {
    return await this.orderModel.find().populate('userId', 'fullName email').populate('items.productId').exec();
  }

  async updateStatus(id: string, status: OrderStatus) {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!updatedOrder) throw new NotFoundException('Buyurtma topilmadi');
    return updatedOrder;
  }

  async cancelOrder(id: string, userId: string, role: string) {
    const query = role === 'ADMIN' || role === 'SELLER' ? { _id: id } : { _id: id, userId };
    const order = await this.orderModel.findOne(query);
    if (!order) throw new NotFoundException('Buyurtma topilmadi yoki ruxsat yo\'q');
    if (order.status === OrderStatus.DELIVERED) {
      throw new NotFoundException('Yetkazilgan buyurtmani bekor qilib bo\'lmaydi');
    }
    order.status = OrderStatus.CANCELLED;
    return await order.save();
  }
}
