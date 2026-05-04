import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Role } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const existingUser = await this.userModel.findOne({ email: body.email });
    if (existingUser) {
      throw new ConflictException('Bu email avval ro\'yxatdan o\'tgan');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    const newUser = new this.userModel({
      fullName: body.fullName,
      email: body.email,
      passwordHash,
      role: body.role || Role.USER,
    });

    await newUser.save();
    return { success: true, message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz' };
  }

  async login(body: any) {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      throw new UnauthorizedException('Email yoki parol hato');
    }

    const isMatch = await bcrypt.compare(body.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email yoki parol hato');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
