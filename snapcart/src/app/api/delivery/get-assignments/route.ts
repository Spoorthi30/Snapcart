import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models.ts/DeliveryAssignment.model";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()

        const session = await auth()
        const userId = session?.user?.id

        // console.log("Current Session:", session);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        // const assignment = await DeliveryAssignment.find({
        //     broadcastedTo : session?.user?.id,
        //     status:"broadcasted"
        // }).populate("order")

        const assignment = await DeliveryAssignment.find({
            broadcastedTo : userId,
            status:"broadcasted"
        }).populate({
            path :"order",
            match : {
                status : 'pending',
                rejectedBy : {$ne : userId}}
        })

        const filterAssignment = assignment.filter((item)=>item.order !== null )

        // return NextResponse.json(
        //     assignment,
        //     {status:200}
        // )

        return NextResponse.json(
            filterAssignment,
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`Error at assignment ${error}`},
            {status:500}
        )
    }
}