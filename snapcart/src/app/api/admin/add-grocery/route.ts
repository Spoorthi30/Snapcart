import { auth } from "@/auth";
import uploadCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models.ts/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()


        const session = await auth();
        if(session?.user?.role !== 'admin'){
            return NextResponse.json(
                {message:"You are not admin"},
                {status:400}
            )
        }
        const formData = await req.formData()
        const name = formData.get('name')
        const category = formData.get('category')
        const unit = formData.get('unit')
        const price = formData.get('price')
        const file = formData.get('image') as Blob | null

        let imageUrl 
        if(file){
            imageUrl = await uploadCloudinary(file)
        }

        const grocery = await Grocery.create({
            name,category,unit,price,image:imageUrl
        })

        return NextResponse.json(
                grocery,
                {status:200}
            )
    } catch (error) {
        return NextResponse.json(
                {message: `Add grocery error - ${error}`},
                {status:400}
            )
    }
}