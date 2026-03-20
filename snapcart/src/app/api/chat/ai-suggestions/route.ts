import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const {message,role} = await req.json()

        const prompt = `You are a  professional delivery assistant chatbot.
        
        You will be given:
        - role : either "user" or "deliveryBoy"
        - last message : the last message sent in the conversation

        Your task : 
        👉 If role is "user" -> generate 3 short Whatsapp - style reply suggestions that a user could send to the delivery boy.
        👉 If role is "deliveryBoy" -> generate 3 short Whatsapp - style reply suggestions that a delivery boy could send to the user.

        Follow these rules:
        - Replies must match the context of the last message.
        - Keep replies short , human-like (max 10 words).
        - Use emojies naturally(max one per reply).
        - No generic replies like "Okay" or "Thank you".
        - Must be helpful,respectful and relevant to delivery , status , help or location.
        - No numbering , no extra instructions , no extra text.
        - Just return coma-seperated reply suggestions

        Return only the three reply suhhestions , coma-seperated.

        Role : ${role}
        Last message : ${message}
        `

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,{
            method : 'POST',
            headers : {"Content-Type":"application/json"},
            body : JSON.stringify({
                "contents": [
                    {
                        "parts": [
                        {
                            "text": prompt
                        }
                        ]
                    }
                ]
            })
        })

        const data = await response.json()
        const replyText = data.candidates?.[0].content.parts?.[0].text || ""
        const suggestions = replyText.split(',').map((s:string)=>s.trim())
        return NextResponse.json(
            suggestions , {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`Gemini error - ${error}`} , {status:500}
        )
    }
}