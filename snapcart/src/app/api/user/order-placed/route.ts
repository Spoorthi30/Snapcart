import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models.ts/order.model";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()

        const { userID , items , paymentMethod , totalAmount , address } = await req.json()

        if(!userID || !items || !paymentMethod || !totalAmount || !address){
            return NextResponse.json(
                {message : "Enter all credentails"},
                {status:400}
            )
        }

        const user = await User.findById(userID)
        if(!user){
            return NextResponse.json(
                {message : 'User not found'},
                {status:400}
            )
        }

        const newOrder = await Order.create({
            user : userID ,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        await emitEventHandler("new-order",newOrder)

        return NextResponse.json(
                newOrder,
                {status:201}
            )
        

    } catch (error) {
        return NextResponse.json(
                {message : `Error at ordering - ${error}`},
                {status:500}
            )
    }
}
