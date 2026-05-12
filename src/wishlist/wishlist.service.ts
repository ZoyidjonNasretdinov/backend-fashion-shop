import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>) {}

  async getWishlist(userId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId }).populate('products');
    if (!wishlist) wishlist = await new this.wishlistModel({ userId, products: [] }).save();
    return wishlist;
  }

  async toggle(userId: string, productId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) wishlist = new this.wishlistModel({ userId, products: [] });

    const index = wishlist.products.findIndex((p) => p.toString() === productId);
    if (index > -1) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(productId as any);
    }
    return await wishlist.save();
  }
}
