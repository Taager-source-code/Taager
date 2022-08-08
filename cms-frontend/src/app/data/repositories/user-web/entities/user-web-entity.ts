/* eslint-disable @typescript-eslint/naming-convention */
export interface UserEntity {
    _id: string;
    TagerID: number;
    userLevel: number;
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    email: string;
    phoneNum: string;
    loyaltyProgram: {
        loyaltyProgram: string;
        points: number;
        nextPoints: number;
    };
    features: string[];
    referralCode: string;
    createdAt: Date;
    profilePicture: string;
}
