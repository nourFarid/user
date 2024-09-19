
const {PrismaClient}= require('@prisma/client')
const prisma= new PrismaClient()
const errorHandling= require("../utils/errorHandling")
const  httpStatus= require("../utils/httpStatusText")
const hashAndCompare= require("../utils/HashAndCompare")
const generateAndVerifyToken= require("../utils/GenerateAndVerifyToken")

const signUp = errorHandling.asyncHandler(async(req,res,next)=>{
    const {userName,email,password}=req.body
    if(userName){
      const isUserName = await prisma.user.findUnique({
        where:{
            userName: userName
        }
      })
      if(isUserName){
        return next (new Error ("This user is already exist")) 
     }
    }
      if(email){
        const isEmail = await prisma.user.findUnique({
          where:{
              email: email
          }
        })
        if(isEmail){
            return next (new Error ("This email is already exist"))
        }
        
      }

      let photo = "user.png"; // Default photo
      if (req.file) {
        photo = req.file.originalname; 
      }
const user= await prisma.user.create({
    data:{  
        userName,
        email,
        password:hashAndCompare.hash(password),
        photo,
        role: "user"
    }
})
if(user)
    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data:user });
  

     
  } 
   )


   

const login = errorHandling.asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body

      if(email){
        const isEmail = await prisma.user.findUnique({
          where:{
              email: email
          }
        })
        if(!isEmail){
            return next (new Error ("This email is already exist"))
        }
        const match= hashAndCompare.compare(password,isEmail.password)
        if(!match){
            return next (new Error ("Invalid password"))
        }

        if(isEmail&&match)
        {

          const payload = {
            id:isEmail.id,
            userName:isEmail.userName,
            email:isEmail.email,
            role:isEmail.role
          }
          const token = generateAndVerifyToken.generateToken({payload})
          delete isEmail.password
          return res
          .status(200)
          .json({ status: httpStatus.SUCCESS, token });

        }
      
      }

      else
      return res
      .status(404)
      .json({ status: httpStatus.ERROR, data:"Email is required" });

if(user)
    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data:user });
  

     
  } 
   )


  
   module.exports= {
    signUp,login
   }