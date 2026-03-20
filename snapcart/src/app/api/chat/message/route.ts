import connectDB from "@/lib/db";
import Message from "@/models.ts/message.model";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const { roomId } = await req.json()

        const room = await Order.findById(roomId)

        if(!room){
            return NextResponse.json(
                {message:'Room not found'},
                {status : 400}
            )
        }
   
        const messages = await Message.find({roomId:room._id})
        return NextResponse.json(
                messages,
                {status : 200}
            )

    } catch (error) {
        return NextResponse.json(
                {message:`Error at getting messages - ${error}`},
                {status : 500}
            )
    }
}