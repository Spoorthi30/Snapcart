import { auth } from "@/auth";
import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models.ts/DeliveryAssignment.model";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest,{params} : {params : {id : string}}) {
export async function GET(req: NextRequest,context: { params: Promise<{ id: string; }>; }) {
    try {
        await connectDB()

        const {id} = await context.params
        const session = await auth()

        const deliveryBoyId = session?.user?.id

        if(!deliveryBoyId){
            return NextResponse.json({message : "Unauthorized"},{status:400})
        }

        const assignment = await DeliveryAssignment.findById(id)
        if(!assignment){
            return NextResponse.json({message : "No assignemnt found"},{status:400})
        }

        if(assignment.status!=="broadcasted"){
            return NextResponse.json({message : "Assignemnt expired"},{status:400})
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo : deliveryBoyId,
            status : {$nin : ['broadcasted','completed']}
        })

        if(alreadyAssigned){
            return NextResponse.json({message : "Delivery boy is already assigned to other assignment"},{status:400})
        }

        assignment.assignedTo = deliveryBoyId
        assignment.status = 'assigned'
        assignment.acceptedAt = new Date()

        await assignment.save()

        const order = await Order.findById(assignment.order)

        if(!order){
            return NextResponse.json({message : "Order not found"},{status:400})
        }

        order.assignedDeliveryBoy = deliveryBoyId
        await order.save()

        await order.populate("assignedDeliveryBoy")

        await emitEventHandler("order-assigned",{orderId:order._id,assignedDeliveryBoy:order.assignedDeliveryBoy})

        await DeliveryAssignment.updateMany(
            { _id : {$ne : assignment._id},
              broadcastedTo : deliveryBoyId,
              status : "broadcasted"
            },
            { 
                $pull : {broadcastedTo : deliveryBoyId}
            }
        )

        await emitEventHandler('remove-assignment',{assignmentId:id})

        return NextResponse.json({message : "Order accepted successfully"},{status:200})

    } catch (error) {
        return NextResponse.json({message : `Error at accept asignment-${error}`},{status:500})
    }
}