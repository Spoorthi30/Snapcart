import mongoose from "mongoose";

export interface IUser{
    _id? : mongoose.Types.ObjectId,
    name : string,
    email : string,
    password : string,
    role : "user" | "admin" | "deliveryBoy",
    mobile : string,
    image?:string,
    location?: {
    type: {
            type: string;
            enum: string[];
            default: string;
        }
    coordinates: {
            type: number[];
            default: number[];
        }
    }
    socketId : string | null
    isOnline : boolean
    pendingEmail : string | null
    emailVerificationToken : string | null
}

const UserSchema = new mongoose.Schema<IUser>({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : false
    },
    mobile : {
        type : String,
    },
    role : {
        type : String,
        enum : ["user","admin","deliveryBoy"],
        default : "user"
    },
    image : {
        type : String
    },
    location :{
        type : {
            type : String,
            enum : ["Point"],
            default : "Point"
        },
        coordinates : {
            type : [Number],
            default : [0,0]
        }
    },
    socketId : {
        type : String,
        default:null
    },
    isOnline :{
        type : Boolean,
        default : false
    },
    pendingEmail: { 
        type: String, 
        default: null 
    },
    emailVerificationToken: { 
        type: String, 
        default: null 
    }
} , 
    {timestamps : true})

    UserSchema.index({location:"2dsphere"})


    const User = mongoose.models.User || mongoose.model("User",UserSchema)
    export default User;