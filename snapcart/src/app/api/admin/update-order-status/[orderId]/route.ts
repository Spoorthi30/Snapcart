import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models.ts/DeliveryAssignment.model";
import Order from "@/models.ts/order.model";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req : NextRequest,{params} : {params : {orderId : string}}) {
export async function POST(req : NextRequest,context: { params: Promise<{ orderId: string; }>; }) {
    try {
        await connectDB()
        // const { orderId } = await params
        const { orderId } = await context.params
        const { status } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json(
                {message : "Order does not exits"},
                {status : 400}
            )
        }

        order.status = status

        let deliveryBoyPayload

        if(status==="out for delivery" && !order.assignment){
            const { latitude , longitude } = order.address


            const nearByDeliveryBoys = await User.find({
                role : "deliveryBoy",
                location : {
                    $near : {
                        $geometry : {type : "Point",coordinates:[Number(longitude),Number(latitude)]},
                        $maxDistance : 10000
                    }
                }
            }) 

            nearByDeliveryBoys.forEach(boy => {
                console.log(`FOUND: ${boy.name}`);
                console.log(`User DB Location: ${boy.location.coordinates}`); 
            });

            const nearByDeliveryBoysIds = nearByDeliveryBoys.map((boy)=>boy._id)
            const buzyIds = await DeliveryAssignment.find({
                assignedTo : {$in:nearByDeliveryBoysIds},
                status : {$nin :["broadcasted","completed"]}
            }).distinct("assignedTo")
            const busyIdsSet = new Set(buzyIds.map(id => String(id)))
            const availableDeliveryBoy = nearByDeliveryBoys.filter(
                boys => !busyIdsSet.has(String(boys._id))
            )

            const candidates = availableDeliveryBoy.map(boys => boys._id)

            console.log(candidates.length)

            if(candidates.length === 0){
                await order.save()

                await emitEventHandler("order-status-update",{orderId:order._id,status:order.status,isPaid: order.isPaid})

                return NextResponse.json(
                    {message : "No delivery boys available"},
                    {status : 200}
                )
            }

            const existingAssignment = await DeliveryAssignment.findOne({ order: order._id });
            if (existingAssignment) {
                return NextResponse.json({ message: "Assignment already broadcasted" }, { status: 200 });
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order : order._id,
                broadcastedTo : candidates,
                status : "broadcasted"
            })  

            await deliveryAssignment.populate('order')
            for(const boyId of candidates){
                const boy = await User.findById(boyId)
                if(boy.socketId){
                    await emitEventHandler("new-assignment",deliveryAssignment,boy.socketId
                    )
                }
            }

            order.assignment = deliveryAssignment._id
            deliveryBoyPayload = availableDeliveryBoy.map(b=>({
                id : b._id,
                name : b.name,
                mobile : b.mobile,
                longitude : b.location.coordinates[0],
                latitude : b.location.coordinates[1]
            }))
        }

        await order.save()
        await order.populate("user")

        await emitEventHandler("order-status-update",{orderId:order._id,status:order.status,isPaid: order.isPaid})

        return NextResponse.json(
            {
                assignment : order.assignment?._id,
                availableBoys : deliveryBoyPayload
            },
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
                {message :`Error while updating order status - ${error}`},
                {status : 400}
            )
    }
}