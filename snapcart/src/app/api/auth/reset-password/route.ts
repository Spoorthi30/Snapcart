import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()

        const {password,token,id} = await req.json()

        if(!password || !token || !id){
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findById(id).select('+password')
        if(!user){
            return NextResponse.json(
                {message:'User not found'},
                {status:400}
            )
        }

        const secret = process.env.AUTH_SECRET + user.password

        try {
            jwt.verify(token,secret)
        } catch (error) {
            return NextResponse.json(
                {message:'Link is expired or already beeen used'},
                {status:400}
            )
        }

        const hashpassword = await bcrypt.hash(password,10)

        user.password = hashpassword
        await user.save()

        return NextResponse.json(
            {message:'Password updated successfully'},
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`Error while updating the password-${error}`},
            {status:500}
        )
    }
}