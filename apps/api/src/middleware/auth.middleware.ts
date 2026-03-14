import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export const authMiddleware =  (req:Request,res:Response,next:NextFunction)=>{
    const authHead = req.headers.authorization
    if(!authHead || !authHead?.startsWith("Bearer ")) return res.status(401).json({message:"Unauthorized"});
    const token = authHead.split(" ")[1]
  
    try {
          
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string)  as JwtPayload &{userId:string}
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid Token"})
    }
}