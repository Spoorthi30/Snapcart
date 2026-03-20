import connectDB from "@/lib/db";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(req:NextRequest,{params}:{params : {orderId : string}}) {
export async function GET(req:NextRequest,context: { params: Promise<{ orderId: string; }>; }) {
    try {
        await connectDB()
        const {orderId} = await context.params
        const order = await Order.findById(orderId).populate("assignedDeliveryBoy")

        if(!order){
            return NextResponse.json(
                {message:'No order found'},
                {status : 400}
            )
        }

        return NextResponse.json(
                order,
                {status : 200}
            )

    } catch (error) {
        return NextResponse.json(
                {message:`Error at get order for tracking - ${error}`},
                {status : 500}
            )
    }
}