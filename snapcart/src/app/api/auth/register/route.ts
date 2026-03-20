import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB();

        const { name , email ,password } = await req.json();

        const exisitngUser = await User.findOne({email})
        if(exisitngUser){
            return NextResponse.json(
                {message : "User already exists"},
                {status:400}
            )
        }

        if(password.length < 6){
            return NextResponse.json([
                {message : "Password must contain atleast 6 charecters"},
                {status:400}
            ])
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name , email , password : hashedPassword
        })

        return NextResponse.json(
            user,
            {status : 200}
        )
    } catch (error) {
        return NextResponse.json([
                {message : `Register error ${error}`},
                {status:500}
            ])
    }
}