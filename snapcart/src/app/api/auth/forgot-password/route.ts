import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/mailer";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const {email} = await req.json()

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json(
                {message:'If this user exist a reset link has been sent'},
                {status:400}
            )
        }

        const secret = process.env.AUTH_SECRET + user.password

        const token = jwt.sign(
            {id:user._id,email:user.email},
            secret,
            {expiresIn:"15m"}
        )

        const resetLink = `${process.env.NEXT_BASE_URL}/reset-password?token=${token}&id=${user._id}`

        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #16a34a;">Reset Your Snapcart Password</h2>
                <p>We received a request to reset your password. Click the button below to proceed:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">This link will expire in 15 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `;

        await sendMail(user.email,"Password Reset - Snapcart",htmlContent)

        // console.log("----------------------------");
        // console.log("RESET LINK for", email, ":");
        // console.log(resetLink);
        // console.log("----------------------------");

        return NextResponse.json({ 
            message: "Recovery link sent! Please check your email." 
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json(
        { message: "Internal Server Error" }, 
        { status: 500 }
        );
    }
}