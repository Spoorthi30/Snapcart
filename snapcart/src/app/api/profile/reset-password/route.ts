import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()

        const session = await auth()
        const userId = session?.user?.id

        if (!userId) return NextResponse.json(
            { message: "Unauthorized" }, 
            { status: 401 }
        );

        const {currentPassword,newPassword}= await req.json()

        if(currentPassword === newPassword){
            return NextResponse.json(
                {message:'Current Password and New Password cannot be same'},
                {status:400}
            )
        }

        const user = await User.findById(userId).select('+password')
        
        const isMatch = await bcrypt.compare(currentPassword,user.password)
        if(!isMatch){
            return NextResponse.json(
                { message: "Current password is wrong" },
                { status: 400 }
            );
        }

        const hashPassword = await bcrypt.hash(newPassword,10)
        user.password = hashPassword
        await user.save()

        return NextResponse.json(
            { message: "Password updated successfully" }, 
            { status: 200 }
        );

     } catch (error) {
        return NextResponse.json(
                {message:`Error while resetting the password-${error}`},
                {status:400}
            )
    }
}