import dotenv from "dotenv";
//require('dotenv').config({path:'./env'})
import connectDB from "./db/index.js";

  dotenv.config({
      path:'./env'
})

connectDB()