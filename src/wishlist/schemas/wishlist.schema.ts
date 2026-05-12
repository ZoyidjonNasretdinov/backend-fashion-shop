import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Clothing' }])
  products: string[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
