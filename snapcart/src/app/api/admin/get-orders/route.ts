import connectDB from "@/lib/db";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()
        const orders = await Order.find({}).populate("user assignedDeliveryBoy").sort({createdAt:-1})

        return NextResponse.json(
            orders,
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message : `Error at get order ${error}`},
            {status:400}
        )
    }
}