import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Grocery from "@/models.ts/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest){
    try {
        await connectDB()

        const session = await auth()
        
        if(session?.user?.role!=='admin'){
            return NextResponse.json(
                {message:'You cannot delete the grocery item'},
                {status:400}
            )
        }

        const {groceryId} = await req.json()

        await Grocery.findByIdAndDelete(groceryId)

        return NextResponse.json(
            {message:'Deleted successfully'},
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`Error at deleting item - ${error}`},
            {status:500}
        )
    }
}