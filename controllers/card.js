const {PrismaClient}= require('@prisma/client')
const prisma= new PrismaClient()
const errorHandling= require("../utils/errorHandling")
const httpStatus= require("../utils/httpStatusText")
const email= require("../utils/email")
const cloudinary= require("../utils/cloudinary")
const{getUser }= require("../utils/googleUser")
const user= getUser()
// const addCard = errorHandling.asyncHandler(async(req,res,next)=>{

//             const { originalname} = req.file;
//             const{duoDate}=req.body
//             const mysqlDateTime = new Date(duoDate).toISOString(); 
//              const   card= await prisma.card.create({
//                     data:{
//                         title:req.body.title,
//                         description:req.body.description,
//                         category:req.body.category,
//                         photo:originalname,
//                         cardCode:req.body.cardCode,
//                         quantity:parseInt(req.body.quantity),
//                         platform:req.body.platform,
//                         duoDate:mysqlDateTime,
//                         vistorsNumber:req.body.vistorsNumber||0

            
//                     }
//                 })
                
//     return res
//       .status(200)
//       .json({ status: httpStatus.SUCCESS, data:card });
  

     
//   } 
//    )



const addCard = errorHandling.asyncHandler(async (req, res, next) => {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ status: httpStatus.BAD_REQUEST, message: 'No file uploaded' });
      }
  
      // Upload the file to Cloudinary
      const { path: filePath } = req.file;
      const { secure_url: photoUrl } = await cloudinary.uploader.upload(filePath);
  
      // Extract data from request
      const { title, description, category, cardCode, quantity, platform, duoDate, vistorsNumber } = req.body;
      const mysqlDateTime = new Date(duoDate).toISOString();
  
      // Create a new card entry in the database
      const card = await prisma.card.create({
        data: {
          title,
          description,
          category,
          photo: photoUrl, // Store the URL of the uploaded image
          cardCode,
          quantity: parseInt(quantity, 10),
          platform,
          duoDate: mysqlDateTime,
          vistorsNumber: vistorsNumber || 0
        }
      });
  
      // Respond with the created card data
      return res.status(200).json({ status: httpStatus.SUCCESS, data: card });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  });
  


const updateCard = errorHandling.asyncHandler(async (req, res, next) => {
    const {  title, description, category, quantity } = req.body;


    if (!req.params.id) {
        return next(new Error("Card ID is required for updating"));
    }

    const card = await prisma.card.update({
        where: {
            id: parseInt(req.params.id), 
        },
        data: {
            title: title,
            description: description,
            category: category,
            quantity: quantity
        }
    });
    return res.status(200).json({ status: httpStatus.SUCCESS, data: card });
});

const getAllCards= errorHandling.asyncHandler(async(req, res, next)=>{
    const cards= await prisma.card.findMany({

    })
    if(cards.length==0)
        return res.status(404).json({ status: httpStatus.NOT_FOUND, message:"No cards found" });
    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data:cards });
   
})   
const deleteCard= errorHandling.asyncHandler(async(req, res, next)=>{
    const card= await prisma.card.delete({
        where:{
            id:parseInt(req.params.id)
        }
    })
    if(!card)
        return next(new Error("card not found"));

    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data:"deleted successfully" });
   
})   
const getCardWithId= errorHandling.asyncHandler(async(req, res, next)=>{
    const id= req.params.id
    const card= await prisma.card.findUnique({
        where:{
            id:parseInt(id)
        },
        include:{
            vouchers:true
        }
        
    })

    if(!card)
        return next(new Error("card not found"));
    
    
    const vistorsNumber= await prisma.card.update({
        where:{
            id:parseInt(id)
        },
        data:{
            vistorsNumber: card.vistorsNumber+1 
        }
    })
    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data:card });
   
})   

const getCount = errorHandling.asyncHandler(async (req, res, next) => {
    const { title } = req.body;

    if (!title) {
        return next(new Error("title is required"));
    }

   
    const cards = await prisma.card.count({
        where:{
            title:title
        }

    })
    return res.status(200).json({ status: httpStatus.SUCCESS, data: { title,cards } });
});


const getVistorsNumber=errorHandling.asyncHandler(async (req,res,next) => {
    const id= req.params.id
    if(!id)
        return next(new Error("id is required"));
    const card= await prisma.card.findUnique({
        where:{
            id:parseInt(id)
        }
    })
    if(!card)
        return next(new Error("card not found"));
    return res.status(200).json({ status: httpStatus.SUCCESS, data: {vistorsNumber:card.vistorsNumber } });


})

const buyVouchersAndCards=errorHandling.asyncHandler(async(req,res,next)=>{
const cardId= req.body.cardId;
const voucherId= req.body.voucherId;
const quantity= req.body.quantity;
const to=req.body.to || user

console.log('=========in api===========================');
console.log(user.email);
console.log('====================================');
const card= await prisma.card.findUnique({
    where:{
        id:parseInt(cardId)
    }
})
if(!card)
    return next(new Error("card not found"));
if(card.quantity==0)
    return next(new Error("card is out of stock"));
const voucher= await prisma.voucher.findUnique({
    where:{
        id:parseInt(voucherId)
    }
})
if(!voucher)
    return next(new Error("voucher not found"));
if(voucher.quantity==0)
    return next(new Error("voucher is out of stock"));


//TODO: add buying mechanisms

const updatedQuantity= await prisma.card.update({
    where:{
        id:parseInt(cardId)
    },
    data:{
        quantity: card.quantity-quantity
    }
})
const updatedVoucher= await prisma.voucher.update({
    where:{
        id:parseInt(voucherId)
    },
    data:{
        quantity: voucher.quantity-1
    }
})
// Send email to user with Card Code
const mail = await email.sendEmail(
    to,
    "Your Game Card Purchase - " + card.title,
    "Dear Gamer, here is your game card",
    `
    <div style="text-align: center;">
    <img src="${card.photo}" alt="Game Card Image" style="max-width: 100%; height: auto; margin: 20px 0;">
    </div>
    <p>Dear Gamer,</p>
    <p>Thank you for purchasing the <strong>${card.title}</strong> card.</p>
    <p>Here are the details of your purchase:</p>
    <ul>
        <li><strong>Card Title:</strong> ${card.title}</li>
        <li><strong>Description:</strong> ${card.description}</li>
        <li><strong>Category:</strong> ${card.category}</li>
        <li><strong>Platform:</strong> ${card.platform}</li>
        <li><strong>Quantity you bought:</strong> ${quantity}</li>
        <li><strong>Card Code:</strong> ${card.cardCode}</li>
        <li><strong>Expiration Date:</strong> ${card.duoDate.toLocaleDateString()}</li>
    </ul>
    <p>With voucher:</p>
      <ul>
        <li><strong>voucher price:</strong> ${voucher.price}</li>
        <li><strong>quantity:</strong> ${quantity}</li>
       
    </ul>
    <p>Please keep this email for your records.</p>
    <p>If you have any questions or need support, feel free to contact our support team.</p>
    <p>Thank you for choosing our platform. We hope you enjoy your purchase!</p>
    <p>Best regards,</p>
    <p>The Gaming Studio Team</p>
    `
);


if (!mail) {
    return next(new Error("Cannot send email"));
}

return res.status(200).json({ status: httpStatus.SUCCESS, data: {message:"Purchase successful", card, voucher,mail } });

})




module.exports={
    addCard,getAllCards,getCardWithId,deleteCard,updateCard,getCount,getVistorsNumber,buyVouchersAndCards
}

{/* <img src="https://fa57-197-36-220-166.ngrok-free.app/uploads/${card.photo}" alt="Game Card Image" style="max-width: 100%; height: auto; margin: 20px 0;"> */}
{/* <img src="https://distributedrewards-production.s3.amazonaws.com/uploads/gift_card_logo/9246/62fd8d9f-506e-4495-a033-6142f7c0eb48.jpg" alt="Game Card Image" style="max-width: 100%; height: auto; margin: 20px 0;"> */}
