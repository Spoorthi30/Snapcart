/* eslint-disable */

import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models.ts/user.model";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const {token,action} = await req.json()

        if(!token){
            return NextResponse.json(
                {message:'Missing token'},{status:400}
            )
        }

        let decode : any

        try {
            decode = jwt.verify(token,process.env.AUTH_SECRET!)
        } catch (error) {
            return NextResponse.json({ message: `Link expired or invalid-${error}` }, { status: 400 })
        }

        const {userId , email:newEmail } = decode

        const user = await User.findById(userId)
        if(!user){
            return NextResponse.json(
                {message:'User does not exists'},
                {status:400}
            )
        }

        if(action==='cancel'){
            user.pendingEmail = null;
            user.emailVerificationToken = null;
            await user.save()

            return NextResponse.json({ message: "Email change cancelled. Account secured." });
        }

        if(action==='confirm'){
            if(user.pendingEmail !== newEmail){
                return NextResponse.json({ message: "Request outdated. Please start over." }, { status: 400 });
            }

            user.email = newEmail
            user.pendingEmail = null
            user.emailVerificationToken = null

            await user.save()

            return NextResponse.json({ message: "Email updated successfully!" }, { status: 200 });
        }

    } catch (error) {
        console.error("VERIFY_EMAIL_ERROR:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}