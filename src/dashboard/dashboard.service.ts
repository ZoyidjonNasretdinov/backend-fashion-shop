import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Role } from '../users/schemas/user.schema';
import { Clothing } from '../clothing/schemas/clothing.schema';
import { Order, OrderStatus } from '../orders/schemas/order.schema';
import { Review } from '../reviews/schemas/review.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async getAdminStats() {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: Role.USER }),
      this.userModel.countDocuments({ role: Role.SELLER }),
      this.clothingModel.countDocuments(),
      this.clothingModel.countDocuments({ isActive: true }),
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ status: OrderStatus.PENDING }),
      this.orderModel.countDocuments({ status: OrderStatus.CONFIRMED }),
      this.orderModel.countDocuments({ status: OrderStatus.DELIVERED }),
      this.orderModel.countDocuments({ status: OrderStatus.CANCELLED }),
    ]);

    // Jami tushum (yetkazilgan buyurtmalar)
    const revenueResult = await this.orderModel.aggregate([
      { $match: { status: OrderStatus.DELIVERED } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total ?? 0;

    // Oylik buyurtmalar statistikasi (oxirgi 6 oy)
    const monthlyOrders = await this.orderModel.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    // Top 5 mahsulot (buyurtmalar soniga qarab)
    const topProducts = await this.orderModel.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', totalSold: { $sum: '$items.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'clothings', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { totalSold: 1, 'product.name': 1, 'product.price': 1, 'product.images': 1 } },
    ]);

    return {
      users: { totalUsers, totalSellers },
      products: { totalProducts, activeProducts },
      orders: { totalOrders, pendingOrders, confirmedOrders, deliveredOrders, cancelledOrders },
      revenue: { totalRevenue },
      monthlyOrders,
      topProducts,
    };
  }

  async getSellerStats(sellerId: string) {
    const [myProducts, activeProducts, inactiveProducts] = await Promise.all([
      this.clothingModel.countDocuments({ sellerId }),
      this.clothingModel.countDocuments({ sellerId, isActive: true }),
      this.clothingModel.countDocuments({ sellerId, isActive: false }),
    ]);

    // Seller mahsulotlariga tegishli buyurtmalar
    const myProductIds = await this.clothingModel.find({ sellerId }).distinct('_id');

    const [totalOrders, pendingOrders, confirmedOrders, deliveredOrders] = await Promise.all([
      this.orderModel.countDocuments({ 'items.productId': { $in: myProductIds } }),
      this.orderModel.countDocuments({ 'items.productId': { $in: myProductIds }, status: OrderStatus.PENDING }),
      this.orderModel.countDocuments({ 'items.productId': { $in: myProductIds }, status: OrderStatus.CONFIRMED }),
      this.orderModel.countDocuments({ 'items.productId': { $in: myProductIds }, status: OrderStatus.DELIVERED }),
    ]);

    // Seller daromadi
    const revenueResult = await this.orderModel.aggregate([
      { $match: { 'items.productId': { $in: myProductIds }, status: OrderStatus.DELIVERED } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total ?? 0;

    // Seller mahsulotlarining reytingi
    const avgRatingResult = await this.reviewModel.aggregate([
      { $match: { productId: { $in: myProductIds } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
    ]);
    const avgRating = avgRatingResult[0]?.avgRating?.toFixed(1) ?? 0;
    const totalReviews = avgRatingResult[0]?.totalReviews ?? 0;

    // Seller top mahsulotlari
    const topProducts = await this.clothingModel
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price images discount isActive');

    return {
      products: { myProducts, activeProducts, inactiveProducts },
      orders: { totalOrders, pendingOrders, confirmedOrders, deliveredOrders },
      revenue: { totalRevenue },
      reviews: { avgRating, totalReviews },
      topProducts,
    };
  }
}
