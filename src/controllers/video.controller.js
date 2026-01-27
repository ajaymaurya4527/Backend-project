import { isValidObjectId } from "mongoose"
import { User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const publishVideo=asyncHandler(async (req,res)=>{
    const {title,description}=req.body

    if (!title || !description){
        throw new ApiError(400,"all fields are required")
    }

    const videoLocalPath=req.files?.videoFile[0]?.path;
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path;

    if (!videoLocalPath){
        throw new ApiError(400,"videofile required")
    }
    if (!thumbnailLocalPath){
        throw new ApiError(400,"thubnail required")
    }

    const videoFile=await uploadOnCloudinary(videoLocalPath);
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile){
        throw new ApiError(400,"video is missing")
    }
    if (!thumbnail){
        throw new ApiError(400,"thumbnail is missing")
    }

    const video=await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title,
        description,
        duration:videoFile.duration,
        owner:req.user?._id,
        isPublished:false
    })

    const videoUploaded=await Video.findById(video?._id);

    if(!videoUploaded){
        throw new ApiError(400,"video uploadinng failed please try agai")
    }

    return res.status(200)
    .json(new ApiResponse(200,video,"video uploaded successfully"))

    

})

const getVideoById=asyncHandler(async (req,res)=>{
    const {videoId}=req.params

})

const updateVideo=asyncHandler(async (req,res)=>{
    const {videoId}=req.params
    const {title,description}=req.body

    if (!isValidObjectId(videoId)){
        throw new ApiError(400,"video not found")
    }

    if (!title || !description){
        throw new ApiError(400,"both fields are required")
    }

    const video=await Video.findById(videoId)
    if (!video){
        throw new ApiError(400,"video not found")
    }

    if (video?.owner.tostring() !== req.user?._id.tostring()){
        throw new ApiError(400,"you can't edit video you are not owner of this video")
    }

    //deleting thumbnail old one

    const thumbnailToDelete=await Video.findByIdAndDelete(video?._id,
        {
            $set:{
            thumbnail:thumbnail.url
        }
        },{
            new:true
        }
    )

    if (thumbnailToDelete){
        throw new ApiError(400,"privious thumbnail url not deleted")
    }

    const thumbnailLocalPath=req.file?.path

    if (!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail is missing")
    }

    const thumbnailUploadOnCloudinary=await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailUploadOnCloudinary.url){
        throw new ApiError(400,"error while uploading on cloudinary")

    }

    const updatedVideo=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail:thumbnailUploadOnCloudinary.url
                
            }
        },{
            new:true
        }
    )

    return res.status(200)
    .json(ApiResponse(200,updatedVideo,"updatevideo successfully"))
})

const deleteVideo=asyncHandler(async (req,res)=>{
    const {videoId}=req.params

    if (!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid videoid")
    }

    const video=await Video.findById(videoId);
    if (!video){
        throw new ApiError(400,"video not found")
    }

    if (video?.owner.tostring() !== req.user?._id.tostring()){
        throw new ApiError(400,"you are not able to delete because you are not owner of this video")
    }

    const deleteVideoUrl=await Video.findByIdAndDelete(video._id)
        
    if (deleteVideoUrl){
        throw new ApiError(400,"erroe while deleting")
    }

    return res.status(200)
    .json(200,deleteVideoUrl),"video delete successfully"
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video id")
    }

    const video=await Video.findById(videoId)
    if (!video){
        throw new ApiError(400,"video not found")
    }

    if (video.owner?.tostring() !== req.user?._id.tostring()){
        throw new ApiError(400,"you are not owner of this video")
    }

    const isPublishStatus= await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                isPublished:!video.isPublished
            }
        }
    )

    if (!isPublishStatus){
        throw new ApiError(500,"unable to toggle publish status")
    }

    return res.status(200)
    .json(200,{isPublish:isPublishStatus.isPublished},"video publish toggle succeessfully")

    
})


export {publishVideo,updateVideo,deleteVideo,getVideoById,togglePublishStatus}