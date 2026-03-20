import connectDB from "@/lib/db";
import Grocery from "@/models.ts/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()
        const groceries = await Grocery.find({})
        return NextResponse.json(groceries,{status:200})
    } catch (error) {
        return NextResponse.json(
            {message:`Get grocery error-${error}`},
            {status:500}
        )
    }
}