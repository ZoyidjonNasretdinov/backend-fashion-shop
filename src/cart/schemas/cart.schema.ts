import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: string;

  @Prop([{
    productId: { type: MongooseSchema.Types.ObjectId, ref: 'Clothing', required: true },
    quantity: { type: Number, required: true, default: 1 },
    size: String,
    color: String,
  }])
  items: any[];

  @Prop({ default: 0 })
  totalAmount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
