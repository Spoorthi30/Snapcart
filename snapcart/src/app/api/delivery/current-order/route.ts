import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models.ts/DeliveryAssignment.model";
import Order from "@/models.ts/order.model"; 
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()

        const session = await auth()
        const deliveryBoyId = session?.user?.id

        const activeAssignment = await DeliveryAssignment.findOne({
            assignedTo : deliveryBoyId,
            status : "assigned"
        }).populate(
            {
                path : "order",
                populate : { path : "address" }
            }
        ).lean()

        if(!activeAssignment){
            return NextResponse.json({active:false},{status:200})
        }

        return NextResponse.json({active:true,assignment:activeAssignment},{status:200})

    } catch (error) {
        return NextResponse.json({message:`current order error - ${error}`},{status:500})
    }
}