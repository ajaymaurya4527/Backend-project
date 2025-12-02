import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))

app.use(cookieParser())

//routes
import router from "./routes/user.route.js";

//routes declearation
app.use("/api/v1/users",router)//app.use("/api/v1/users" that transfer you on router file and then what will /work we need urlthen work

//example of url http://localhost:8000//api/v1/users/register
export default app;