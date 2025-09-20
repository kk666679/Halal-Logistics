import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare enum UserRole {
    SUPPLIER = "supplier",
    CERTIFIER = "certifier",
    AUDITOR = "auditor",
    CONSUMER = "consumer"
}
export declare class User {
    _id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyName?: string;
    phoneNumber?: string;
    address?: string;
    isActive: boolean;
    profileImage?: string;
    certificationNumber?: string;
    licenseNumber?: string;
    refreshToken?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
