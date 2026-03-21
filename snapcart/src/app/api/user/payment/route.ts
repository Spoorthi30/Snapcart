import connectDB from "@/lib/db";
import Order from "@/models.ts/order.model";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CartItem {
  grocery: string;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  image?: string;
}

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

        // const newOrder = await Order.create({
        //     user : userID ,
        //     items,
        //     paymentMethod,
        //     totalAmount,
        //     address
        // })

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"],
            mode : "payment",
            success_url : `${process.env.NEXT_BASE_URL}/user/order-success`,
            cancel_url : `${process.env.NEXT_BASE_URL}/user/order-cancel`,
            line_items: [
                {
                    price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'SnapCart Order Payment',
                    },
                    unit_amount: totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata : {
                // orderId : newOrder._id.toString()

                userID: userID.toString(),
                address: JSON.stringify(address),
                // We store just IDs or a simplified string to stay under the character limit
                cartItems: JSON.stringify(items.map((item: CartItem) => ({
                    grocery: item.grocery,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    unit: item.unit,
                    image: item.image
                })))
            }
        })

        return NextResponse.json(
                {url : session.url},
                {status:201}
            )
    } catch (error) {
        return NextResponse.json(
                {message : `Error at order payment - ${error}`},
                {status:500}
            )
    }
}