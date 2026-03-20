import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models.ts/DeliveryAssignment.model";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const {orderId,otp} = await req.json()

        if(!orderId || !otp){
            return NextResponse.json(
                {message:'orderId or OTP not found'},
                {status:400}
            )
        }

        const order = await Order.findById(orderId)

        if(!order){
            return NextResponse.json(
                {message:'orderId not found'},
                {status:400}
            )
        }

        if (order.deliveryOtp !== otp) {
            return NextResponse.json({message: 'Invalid OTP'}, {status: 400})
        }

        order.status = "delivered"
        order.deliveryOtpVerify = true
        order.isPaid = true
        order.deliveredAt = new Date()

        await order.save()

        await DeliveryAssignment.updateOne(
            {order : orderId},
            {$set:{assignedTo:null , status:"completed"}}
        )

        await emitEventHandler("order-status-update", {
            orderId: order._id,
            status: "delivered",
            isPaid: order.isPaid
        })

        return NextResponse.json(
                {message:'Delivered successfully'},
                {status:200}
            )

    } catch (error) {
        return NextResponse.json(
                {message:`Error at verify otp - ${error}`},
                {status:500}
            )
    }
}