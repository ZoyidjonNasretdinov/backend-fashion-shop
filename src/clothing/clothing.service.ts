import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clothing } from './schemas/clothing.schema';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';

@Injectable()
export class ClothingService {
  constructor(
    @InjectModel(Clothing.name) private clothingModel: Model<Clothing>,
  ) {}

  async create(createDto: CreateClothingDto, sellerId: string) {
    const newClothing = new this.clothingModel({
      ...createDto,
      sellerId,
    });
    return await newClothing.save();
  }

  async findAll() {
    return await this.clothingModel.find({ isActive: true }).populate('sellerId', 'fullName email');
  }

  async findOne(id: string) {
    const item = await this.clothingModel.findById(id).populate('sellerId', 'fullName email');
    if (!item) {
      throw new NotFoundException('Kiyim topilmadi');
    }
    return item;
  }

  async update(id: string, updateDto: UpdateClothingDto, sellerId: string) {
    const item = await this.clothingModel.findOneAndUpdate(
      { _id: id, sellerId },
      updateDto,
      { new: true },
    );
    if (!item) {
      throw new NotFoundException('Kiyim topilmadi yoki sizda ruxsat yo\'q');
    }
    return item;
  }

  async remove(id: string, sellerId: string) {
    const item = await this.clothingModel.findOneAndDelete({ _id: id, sellerId });
    if (!item) {
      throw new NotFoundException('Kiyim topilmadi yoki sizda ruxsat yo\'q');
    }
    return { success: true, message: 'Kiyim muvaffaqiyatli o\'chirildi' };
  }

  async findBySeller(sellerId: string) {
    return await this.clothingModel.find({ sellerId });
  }
}
