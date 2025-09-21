import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User, UserDocument } from "../users/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "your-secret-key",
    });
  }

  async validate(payload: any) {
    const { email, sub: userId } = payload;

    const user = await this.userModel.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive");
    }

    return { userId: user._id, email: user.email, role: user.role };
  }
}
