const {PrismaClient}= require('@prisma/client')
const prisma= new PrismaClient()
const errorHandling= require("../utils/errorHandling")
const  httpStatus= require("../utils/httpStatusText")
const email= require("../utils/email")
// const {user}= require("../strategies/passport-setup")


const changProfilePhoto= errorHandling.asyncHandler(async(req, res, next)=>{
    const   {id}= req.params

    const user= await prisma.user.findUnique({
        where:{id:parseInt(id) }
    })

    if(!user)
        return next(new Error("user not found"));let photo
   if (req.file) {
        photo = req.file.originalname;
      }

    const updatedUser= await prisma.user.update({
        where:{id:parseInt(id) },
        data:{
            photo:photo
        }
    })

    if(!updatedUser)
        return next(new Error("can not update user profile"));
    return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data:updatedUser });
})


const changeInfo=errorHandling.asyncHandler(async(req, res, next)=>{


    const   {id}= req.params
    const user= await prisma.user.findUnique({
        where:{id:parseInt(id) }
    })
    if(!user)
        return next(new Error("user not found"));
    const updatedUser= await prisma.user.update({
        where:{id:parseInt(id) },
        data:req.body
    })
    if(!updatedUser)
        return next(new Error("can not update user"));
    
    return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data:updatedUser });

})

const getAllUsers=errorHandling.asyncHandler(async(req,res,next)=>{
 
    const users= await prisma.user.findMany({
        where:{
            role: "user"
        }
    })

    if(users.length==0)
        return res.status(httpStatus.NOT_FOUND).json({message:"No users found"})
    
    return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data:users });
})


const sendEmail = errorHandling.asyncHandler(async (req, res, next) => {
const subjest=req.body.subjest

    const mail = await email.sendEmail(
        subjest,
        "Game card code",
        "Here is your game card"
    );

    if (!mail) {
        return next(new Error("can not send email"));
    }
    
    return res.status(200).json({ status: "success", data: mail });
});
















module.exports={
    changProfilePhoto,getAllUsers,changeInfo,sendEmail

}