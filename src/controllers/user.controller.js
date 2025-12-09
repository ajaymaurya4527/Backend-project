import { asyncHandler } from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiError.js";
import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()
        

        user.refreshToken = refreshToken
        //await user.save({ validateBeforeSave: false })
        
        

        return {accessToken, refreshToken}


    } catch (error) {
        throw new apiErrors(500, "Something went wrong while generating referesh and access token")
    }
}




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
    //console.log("email:",email)

    if (
        [username,email,fullName,password].some((field)=>field?.trim()==="")
    ){
        throw new apiErrors(400,"all fields are required")
    }
    // if (emai===""){throw throw new apiErrors(400,"all fields are required")}
    // for all details then it also ok no problem

    const existedUser=await User.findOne({
        $or:[{email},{username}]
    })

    if (existedUser){
        throw new apiErrors(409,"this email or passwprd already exits")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files?.coverImage[0]?.path
    }

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
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    

    if (!createdUser){
        throw new apiErrors(500,"something went wrong while registtering the user")

    }

    return res.status(201).json(new apiResponse(200,createdUser,"user registered successfully"))

    


})

const loginUser=asyncHandler(async (req,res)=>{
    //get user login details 1
    //username and email 2 
    //find user 3
    //password check 4
    //access and refresh token 5
    //send cookie 6

    //1
    const {username,email,password}=req.body

    //2
    if (!username && !email){
        throw new apiErrors(400,"username or email is required")
    }

    //3
    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if (!user){
        throw new apiErrors(404,"User does not exit")
    }

    //4
    const isPasswordValid=await user.isPasswordCorrect(password)//we use the method of password cheking which is alerady exit in user.model.js
    //we use user in above because we make the methods not already exits and we give user passwor and then compare the password then return

    if (!isPasswordValid){
        throw new apiErrors(401,"invalid password")
    }

    //5
    const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)

    //6

    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )//bhejate samay yeah saab nahi chahiye
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).
    json(new apiResponse(200,
        {
            user:loggedInUser,accessToken,refreshToken
        },"user logged in successfully" 
    ))



})

const logoutUser=asyncHandler(async (req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{refreshToken:undefined}
    },{
        new:true
    })
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"))


})

const refereshToken=asyncHandler(async (req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refereshToken
    if (!incomingRefreshToken){throw new apiErrors(401,"unautherized requiest")}

    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   
    const user=await User.findById(decodedToken._id)
    if(!user){
        throw new apiErrors(401,"invalid aceess token")
    }

    if (incomingRefreshToken !== user?.refreshToken){
        throw new apiErrors(401,"refreshToken expiry or used")
    }

    const options={
        httpOnly:true,
        secure:true
    }
    const {accessToken,newRefereshToken}=generateAccessAndRefereshTokens(user._id)

    return res.status(200).cookie("accesstoken",accessToken,options).cookie("refreshToken",newRefereshToken,options).json(
        new apiResponse(
            200,{accessToken,newRefereshToken},"access token refreshed"
        )
    )

})

export {registerUser,loginUser,logoutUser,refereshToken}