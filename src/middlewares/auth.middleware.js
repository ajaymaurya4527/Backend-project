import apiErrors from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT=asyncHandler(async (req,res,next)=>{

    try {
        const token=req.cookies?.accessToken || req.header("Autherization")?.replace("Bearer ","")//cooki-parser install kiya tha and aap.use as middlewares use kiye the that why excess
        
        if (!token){
            throw new apiErrors(401,"unautherized requiest")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    
        const user=await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
    )
        if (!user){
            throw new apiErrors(401,"invalid access token")
        }
    
        req.user=user
        next()
    
    } catch (error) {
        throw new apiErrors(401,error?.message || "invalid access token")
        
    }


})