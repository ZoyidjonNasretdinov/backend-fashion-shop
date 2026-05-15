import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Clothing extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  price: number; // Asl narx (so'mda)

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sellerId: string;

  @Prop({ default: 0 })
  discount: number; // Chegirma foizi (masalan: 10)

  @Prop({ default: true })
  isActive: boolean;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);

// Yakuniy narxni hisoblash (Chegirma bilan)
ClothingSchema.virtual('finalPrice').get(function () {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount) / 100;
  }
  return this.price;
});

// Narxni so'm formatida chiqarish
ClothingSchema.virtual('priceFormatted').get(function () {
  const formatted = new Intl.NumberFormat('uz-UZ').format(this.price);
  return `${formatted} so'm`;
});

// Chegirmali narxni so'm formatida chiqarish
ClothingSchema.virtual('finalPriceFormatted').get(function () {
  const finalPrice = this.price - (this.price * (this.discount || 0)) / 100;
  const formatted = new Intl.NumberFormat('uz-UZ').format(finalPrice);
  return `${formatted} so'm`;
});
