import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models.ts/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    const rawBody = await req.text();

    let event;

     try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await connectDB();
        const updatedOrder = await Order.findByIdAndUpdate(session?.metadata?.orderId, 
            {isPaid: true},
            { new: true }
        );

        if (updatedOrder) {
            console.log("💰 Payment Success! Emitting socket event...");
            await emitEventHandler("new-order", updatedOrder);
        }
    }
    return NextResponse.json({recived:true},{status:200})
}