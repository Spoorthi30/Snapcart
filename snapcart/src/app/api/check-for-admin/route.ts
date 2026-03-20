import connectDB from "@/lib/db";
import User from "@/models.ts/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()

        const user = await User.find({role:"admin"})
        if(user.length > 0){
            return NextResponse.json(
                {adminExist : true},
                {status : 200}
            )
        }else{
            return NextResponse.json(
                {adminExist : false},
                {status : 200}
            )
        }
    } catch (error) {
        return NextResponse.json(
                {message : `Error while finding admin-${error}`},
                {status : 500}
            )
    }
}