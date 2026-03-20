import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models.ts/DeliveryAssignment.model";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest,context: { params: Promise<{ id: string; }>; }) {
    try {
        await connectDB()

        const {id} = await context.params
        const session =  await auth()
        const deliveryBoyId = session?.user?.id

        const assignment = await DeliveryAssignment.findById(id)
        if(!assignment){
            return NextResponse.json(
                {message:'Assignment not found'},
                {status:400}
            )
        }

        await Order.findByIdAndUpdate(assignment.order,{
            $addToSet : {rejectedBy : deliveryBoyId}
        })

        return NextResponse.json(
            {message:'Rejected the order successsfully'}
        )

    } catch (error) {
        return NextResponse.json({ message: `Error while rejecting the order - ${error}` }, { status: 500 });
    }
}