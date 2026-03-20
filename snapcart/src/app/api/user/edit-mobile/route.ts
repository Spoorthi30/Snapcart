import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB();
        const session = await auth()
        const {role,mobile} = await req.json()
        const user = await User.findOneAndUpdate({email : session?.user?.email},{
            role,mobile
        },{ new: true })
        if(!user){  
            return NextResponse.json({msg:"User not found"},{status:200})
        }
        return NextResponse.json(user,{status:200})
    } catch (error) {
        return NextResponse.json({msg:`Edit role and mobile error - ${error}`},{status:500})
    }
}