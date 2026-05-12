import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Clothing } from '../clothing/schemas/clothing.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId }).populate('items.productId');
    if (!cart) cart = await new this.cartModel({ userId, items: [] }).save();
    return cart;
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.clothingModel.findById(dto.productId);
    if (!product || !product.isActive) throw new NotFoundException('Mahsulot topilmadi');

    let cart = await this.cartModel.findOne({ userId });
    if (!cart) cart = new this.cartModel({ userId, items: [] });

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === dto.productId && i.size === dto.size && i.color === dto.color,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += dto.quantity;
    } else {
      cart.items.push({ productId: dto.productId, quantity: dto.quantity, size: dto.size, color: dto.color });
    }

    const price = product.price * (1 - product.discount / 100);
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + price * item.quantity;
    }, 0);

    return await cart.save();
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Korzina topilmadi');
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    return await cart.save();
  }

  async clearCart(userId: string) {
    return await this.cartModel.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 }, { new: true });
  }
}
