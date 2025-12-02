import { asyncHandler } from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiError.js";
import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser=asyncHandler(async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {username,email,fullName,password}=req.body//if information comes through body and json then we  write req.body
    console.log("email:",email)

    if (
        [username,email,fullName,password].some((field)=>field?.trim()==="")
    ){
        throw new apiErrors(400,"all fields are required")
    }
    // if (emai===""){throw throw new apiErrors(400,"all fields are required")}
    // for all details then it also ok no problem

    const existedUser= User.findOne({
        $or:[{email},{username}]
    })

    if (existedUser){
        throw new apiErrors(409,"this email or passwprd already exits")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new apiErrors(400,"avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar){
        throw new apiErrors(400,"avatar file is required")

    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowercase()
    })

    


})

export {registerUser}