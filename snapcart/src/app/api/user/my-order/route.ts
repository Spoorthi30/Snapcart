import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        const orders = await Order.find({user : session?.user?.id}).populate("user assignedDeliveryBoy").sort({createdAt:-1})

        if(!orders){
            return NextResponse.json(
                {message : "Order not found"},
                {status : 400}
            )
        }

        return NextResponse.json(
                orders,
                {status : 200}
            )
    } catch (error) {
        return NextResponse.json(
                {message : `Error at my order ${error}`},
                {status : 500}
            )
    }
}