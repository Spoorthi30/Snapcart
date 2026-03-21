import mongoose from "mongoose";

export interface IOrder{
    _id : mongoose.Types.ObjectId
    user : mongoose.Types.ObjectId
    items : [
        {
            grocery : mongoose.Types.ObjectId
            name : string
            price : string
            unit : string
            image : string
            quantity : string
        }
    ]
    isPaid : boolean
    totalAmount : number
    paymentMethod : "cod" | "online"
    address : {
        name : string
        mobile : string
        city : string
        state : string
        pincode : string
        fullAddress : string
        latitude : number
        longitude:number
    }
    assignment?: mongoose.Types.ObjectId
    assignedDeliveryBoy? : mongoose.Types.ObjectId   //After creating DeliveryAssignment model
    status : "pending" | "out for delivery" | "delivered"
    createdAt? :Date
    updatedAt? :Date
    rejectedBy : mongoose.Types.ObjectId[]
    stripeSessionId? : string
    deliveryOtp : string
    deliveryOtpVerify : boolean
    deliveredAt : Date
}


const orderSchema = new mongoose.Schema<IOrder>({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    items : [
        {
            grocery : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Grocery",
            required : true
        },
        name : String,
        price : String,
        unit : String,
        image : String,
        quantity : Number,
        }   
        
    ],
    isPaid :  {
        type : Boolean,
        default : false
    },
    totalAmount : Number,
    paymentMethod : {
        type : String,
        enum : ["cod","online"],
        default : "cod"
    },
    address : {
        name : String,
        mobile : String,
        city : String,
        state : String,
        pincode : String,
        fullAddress : String,
        latitude : Number,
        longitude : Number,
    },
    assignment : {
        type : mongoose.Types.ObjectId,
        ref : "DeliveryAssignment",
        default : null
    },
    assignedDeliveryBoy : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    status : {
        type : String,
        enum : ["pending","out for delivery","delivered"],
        default:"pending"
    },
    rejectedBy : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : "User",
            default : []
        }
    ],
    stripeSessionId : {
        type : String,
        unique : true,
        sparse : true
    },
    deliveryOtp : {
        type:String,
        default:null
    },
    deliveryOtpVerify : {
        type:Boolean,
        default:false
    },
    deliveredAt : {
        type : Date
    }
},{
    timestamps : true
})

const Order = mongoose.models.Order || mongoose.model("Order",orderSchema)
export default Order