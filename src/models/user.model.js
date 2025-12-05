import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },//index is for optimization for search
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true, index: true },
    avatar: { type: String, required: true },//type:strinf for cloudinary url
    coverImage: { type: String }, //for cloudinary url
    password: { type: String, required: [true, "password is required"], unique: true },
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    refreshToken: { type: String }



}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    
})

userSchema.methods.isPasswordCorrect = async function (password) {//we can make multiple methods and enject to schema which we made
    return await bcrypt.compare(password, this.password)

}

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )

}
userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )

}




export const User = mongoose.model("User", userSchema);