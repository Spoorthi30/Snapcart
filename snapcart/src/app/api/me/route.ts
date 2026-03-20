import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if(!session || !session.user){
            return NextResponse.json(
                {message : 'User not authenticated'},
                {status : 400}
            )
        }

        const user = await User.findOne({email : session?.user.email}).select("-password")

        if(!user){
            return NextResponse.json(
                {message:"User not found"},
                {status : 400}
            )
        }
        return NextResponse.json(
            user,
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message : `Got an error ${error}`},
            {status : 500}
        )
    }
}