import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
dotenv.config();
const app = express();
app.use(express.json())
app.use(cookieParser())
const port = process.env.PORT 

app.get("/",(req,res)=>{
    res.send("hello guys welcome to leetlab🪄")
})

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/problems",problemRoutes)
app.use("/api/v1/execute-code",executionRoute)
app.use("/api/v1/submission",submissionRoutes)
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})