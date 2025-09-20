import { Model } from 'mongoose';
import { Strategy } from 'passport-jwt';
import { UserDocument } from '../users/user.schema';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    validate(payload: any): Promise<{
        userId: string;
        email: string;
        role: import("../users/user.schema").UserRole;
    }>;
}
export {};
