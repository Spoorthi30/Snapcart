/* eslint-disable */
import { auth } from "@/auth";
import uploadCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/mailer";

export async function PATCH(req:NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        const userId = session?.user?.id

        const user = await User.findById(userId)

        // const {name,mobile,email} = await req.json()
        const formData = await req.formData()
        const name = formData.get('name')
        const mobile = formData.get('mobile')
        const email = formData.get('email')
        const file = formData.get('image') as Blob | null

        let imageUrl = null

        if(file && file.size > 0){
            imageUrl = await uploadCloudinary(file)
            if(!imageUrl) {
                return NextResponse.json({ message: "Cloudinary upload failed" }, { status: 500 });
            }
        }

        let emailChanged = false

        if(email!=user.email){
            const newEmail = await User.findOne({email:email})
            if(newEmail){
                return NextResponse.json({ message: "Email already exists" }, { status: 400 });
            }

            const verificationToken = jwt.sign(
                { userId: userId, email:email }, 
                process.env.AUTH_SECRET!, 
                { expiresIn: '1h' }
            );

            user.pendingEmail = email
            user.emailVerificationToken = verificationToken
            await user.save()

            const verifyLink = `${process.env.NEXT_BASE_URL}/profile/verify-email-change?token=${verificationToken}&action=confirm`
            const cancelLink = `${process.env.NEXT_BASE_URL}/profile/cancel-email-change?token=${verificationToken}&action=cancel`

            await sendMail(
                user.email, 
                "Security Alert: Email Change Requested", 
                `Your Snapcart email is being changed to ${email}. If this wasn't you, click here to CANCEL immediately: <a href="${cancelLink}">CANCEL CHANGE</a>`
            );

            await sendMail(
                email as string, 
                "Verify your new Snapcart email", 
                `Please confirm your new email address by clicking here: <a href="${verifyLink}">CONFIRM NEW EMAIL</a>`
            );

            emailChanged = true
        }

        const updateData : any = {name,mobile} 
        if(imageUrl) updateData.image = imageUrl

        const updateProfile = await User.findByIdAndUpdate(userId,{$set:updateData},{new:true})
        
        return NextResponse.json({
            updateProfile,emailChanged,message: emailChanged ? "Profile updated. Check your NEW email to verify the change." : "Profile updated."},
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`Error while updating the profile-${error}`},
            {status:500}
        )
    }
}