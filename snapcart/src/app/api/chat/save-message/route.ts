import connectDB from "@/lib/db";
import Message from "@/models.ts/message.model";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const { roomId , text , senderId,time } = await req.json()

        const room = await Order.findById(roomId)

        if(!room){
            return NextResponse.json(
                {message:'Room not found'},
                {status : 400}
            )
        }
        
        const message = await Message.create({
            roomId , text , senderId,time
        })

        await message.save()

        return NextResponse.json(
                message,
                {status : 200}
            )

    } catch (error) {
        return NextResponse.json(
                {message:`Error at saving messages - ${error}`},
                {status : 500}
            )
    }
}