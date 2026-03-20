import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Missing lat or lon' }, { status: 400 });
    }

    // Using a very specific User-Agent helps prevent Nominatim blocks
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'NextJS_Grocery_App_User_Agent_1.0',
          'Referer': 'http://localhost:3000'
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    // Check your TERMINAL where npm run dev is running to see this output:
    console.error('--- API ROUTE ERROR ---');
    if (axios.isAxiosError(error)) {
      console.error('OSM Status:', error.response?.status);
      console.error('OSM Data:', error.response?.data);
    } else {
      console.error('General Error:', error);
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}