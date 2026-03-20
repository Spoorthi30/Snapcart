import connectDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const {orderId} = await req.json()

        const order = await Order.findById(orderId).populate("user")

        if(!order){
            return NextResponse.json(
                {message : 'Order not found'},
                {status:400}
            )
        }

        const otp = Math.floor(1000+Math.random()*9000).toString()
        order.deliveryOtp = otp

        await order.save()

        try {
            await sendMail(
                order.user.email,
                "Your delivery OTP",
                `<h2>Your delivery OTP is <strong>${otp}</strong></h2>`
            );
        } catch (mailError) {
                console.error("Mail Error:", mailError);
                return NextResponse.json({ message: 'OTP saved but email failed' }, { status: 500 });
        }
        return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
                {message : `Error at sending otp - ${error}`},
                {status:500}
            )
    }
}