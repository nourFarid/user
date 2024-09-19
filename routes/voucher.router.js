const router= require('express').Router()
const uploadFile= require("../middleware/upload")
const auth = require("../middleware/auth")
const voucher= require("../controllers/voucher")
router.post("/addVoucer",uploadFile.upload.single("avatar"),voucher.addVoucher)
router.get("/getVoucherById/:id",voucher.getVoucherById)
router.get("/getAllVouchers",voucher.getAllVouchers)
router.put("/updateVoucher/:id",voucher.updateVoucher)
router.delete("/deleteVoucher/:id",voucher.deleteVoucher)



module.exports =router