import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
  SUPPLIER = "supplier",
  CERTIFIER = "certifier",
  AUDITOR = "auditor",
  CONSUMER = "consumer",
}

@Schema({ timestamps: true })
export class User {
  _id?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop()
  companyName?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  address?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  profileImage?: string;

  @Prop()
  certificationNumber?: string;

  @Prop()
  licenseNumber?: string;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
