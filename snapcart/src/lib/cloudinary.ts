import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});


const uploadCloudinary = async(file:Blob) : Promise<string | null> => {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if(!file){
        return null
    }
    try{
        return new Promise((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(
                {resource_type : "auto"},
                (error,result)=>{
                    if(error){
                        reject(error)
                    }else{
                        resolve(result?.secure_url || null)
                    }
                }
            )

            uploadStream.end(buffer)
        })
    }catch(error){
        console.log(error)
        return null
    }
}

export default uploadCloudinary;








