import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const { userId , location } = await req.json()

        if(!userId || !location){
            return NextResponse.json(
                {message:"Mission userId or location field"},
                {status:400}
            )
        }
        const user = await User.findByIdAndUpdate(userId,{location})
        if(!user){
            return NextResponse.json(
                {message:"No user found"},
                {status:400}
            )
        }
        return NextResponse.json(
                {success:true},
                {status:200}
            )
    } catch (error) {
        return NextResponse.json(
                {message:`Error while updating location - ${error}`},
                {status:400}
            )
    }
}