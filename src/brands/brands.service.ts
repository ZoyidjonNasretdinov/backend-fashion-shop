import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async create(dto: CreateBrandDto) {
    return await new this.brandModel(dto).save();
  }

  async findAll() {
    return await this.brandModel.find({ isActive: true });
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand topilmadi');
    return brand;
  }

  async update(id: string, dto: Partial<CreateBrandDto>) {
    const updated = await this.brandModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Brand topilmadi');
    return updated;
  }

  async remove(id: string) {
    await this.brandModel.findByIdAndDelete(id);
    return { message: 'Brand o\'chirildi' };
  }
}
