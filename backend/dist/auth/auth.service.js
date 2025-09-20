"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../users/user.schema");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, role, companyName, phoneNumber } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new this.userModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            companyName,
            phoneNumber,
        });
        await user.save();
        const token = this.generateJwtToken(user);
        return { user, token };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const token = this.generateJwtToken(user);
        return { user, token };
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    generateJwtToken(user) {
        const payload = {
            email: user.email,
            sub: user._id,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    async refreshToken(user) {
        return this.generateJwtToken(user);
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateData) {
        const user = await this.userModel
            .findByIdAndUpdate(userId, updateData, { new: true })
            .select('-password');
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map