import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .select('-passwordHash');
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file, 'avatars');
    const user = await this.userModel
      .findByIdAndUpdate(userId, { avatarUrl: result.secure_url }, { new: true })
      .select('-passwordHash');
    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Eski parol noto\'g\'ri');

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await user.save();
    return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  }

  async getAllUsers() {
    return await this.userModel.find().select('-passwordHash');
  }
}
