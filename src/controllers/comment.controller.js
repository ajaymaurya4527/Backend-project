import { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Video } from "../models/video.model.js"
import { json } from "express"

const addcomment=asyncHandler(async (req,res)=>{
    const {videoId}=req.params
    const {content}=req.body

    if (!isValidObjectId(videoId)){
        throw new ApiError(400,"ivalid video id")
    }

    const video=await Video.findById(videoId)
    if (video){
        throw new ApiError(400,"video not found")
    }

    if (!content){
        throw new ApiError(400,"content is required")
    }

    const comment=await Comment.create({
        content,
        video:videoId,
        owner:req.user?._id
    })
     if (!comment) {
        throw new ApiError(500, "Failed to add comment please try again");
    }


    return res.status(200)
    .json(200,comment,"comment added successfully")
})

const updateComment=asyncHandler(async (req,res)=>{
    const {commentId}=req.params
    const {content}=req.body

    if (!isValidObjectId(commentId)){
        throw new ApiError(400,"invalid videoId")
    }
     if (!content){
        throw new ApiError(400,"content is required")
    }
    const comment=await Video.findById(commentId)

    if (!comment){
        throw new ApiError(400,"prev comment not found")
    }

    if (comment?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"you are not owner off the comment")
        
    }

    const newComment=await Comment.findByIdAndUpdate(comment?._id,
        {
            $set:{
                content
            }
        }
    )
    if (!newComment){
        new ApiError(500,"comment updation unsuccessfull please try again")
    }

    return res.status(200)
    .json(200,newComment,"comment update successfully")

    
})

const deleteComment=asyncHandler(async (req,res)=>{
    const {commentId}=req.params

    if (!isValidObjectId(commentId)){
        throw new ApiError(400,"invalid comment id")
    }

    const comment=await Comment.findById(commentId)

    if (!comment){
        throw new ApiError(400,"prev comment not found")
    }

    if (comment.owner?.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"you are not owner of this account")
    }

    const deletedComment=await Comment.findByIdAndDelete(commentId)
    if (!deletedComment){
        throw new ApiError(500,"not deleted please try again")
    }

    return res.status(200)
    .json(200,deleteComment,"comment delete successfully")

})

export {addcomment,updateComment,deleteComment}