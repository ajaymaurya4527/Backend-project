import mongoose,{Schema} from "mongoose";

const subscriptionSchema=new Schema({
    suscriber:{type:Schema.Types.ObjectId,
        ref:"User"//person who is suscribing
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"//one to whom subscribing
    }
},{timestamps:true});

export const Subscription=mongoose.model("Subscription",subscriptionSchema)