const {PrismaClient}= require('@prisma/client')
const prisma= new PrismaClient()
const errorHandling= require("../utils/errorHandling")
const httpStatus= require("../utils/httpStatusText")

const addVoucher = errorHandling.asyncHandler(async(req, res, next)=>{
const cardId= req.body.cardId
if(!cardId)
    return next(new Error("card id is required"));
const card= await prisma.card.findUnique({
    where:{
        id:parseInt(cardId)
    }
})

if(!card){
    return next(new Error("card not found"));
}

let photo="UC.png" // Default photo
if (req.file) {
    photo = req.file.originalname; 
  }
const voucher= await prisma.voucher.create({
    data:{
        price:parseFloat(req.body.price),
        cardId:parseInt(cardId),
        quantity:parseInt(req.body.quantity),
        photo:photo,
    }
})
if(!voucher)
{
    return next(new Error("can not create voucher"));
}
return res
.status(200)
.json({ status: httpStatus.SUCCESS, data:card });



})






const getVoucherById = errorHandling.asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    const voucher = await prisma.voucher.findUnique({
      where: { id: parseInt(id) }
    });
  
    if (!voucher) {
        return next(new Error("voucher not found"));
    }
  
    return res.status(200).json({ status: httpStatus.SUCCESS, data: voucher });
  });
  

  const getAllVouchers = errorHandling.asyncHandler(async (req, res, next) => {
    const vouchers = await prisma.voucher.findMany();
  
    if (vouchers.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "No vouchers found" });
    }
  
    return res.status(200).json({ status: httpStatus.SUCCESS, data: vouchers });
  });
  
  const updateVoucher = errorHandling.asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    const voucher = await prisma.voucher.findUnique({
      where: { id: parseInt(id) }
    });
  
    if (!voucher) {
        return next(new Error("voucher not found"));
    }
  
    const updatedVoucher = await prisma.voucher.update({
      where: { id: parseInt(id) },
      data:req.body
    });
  
    return res.status(200).json({ status: httpStatus.SUCCESS, data: updatedVoucher });
  });
  

  const deleteVoucher = errorHandling.asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    const voucher = await prisma.voucher.findUnique({
      where: { id: parseInt(id) }
    });
  
    if (!voucher) {
        return next(new Error("voucher not found"));
    }
  
    await prisma.voucher.delete({
      where: { id: parseInt(id) }
    });
  
    return res.status(200).json({ status: httpStatus.SUCCESS, message: "Voucher deleted successfully" });
  });
  
module.exports={
    addVoucher,getVoucherById,getAllVouchers,updateVoucher,deleteVoucher
}