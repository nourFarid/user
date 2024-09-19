const router= require('express').Router()
const uploadFile= require("../middleware/upload")
const card = require("../controllers/card")
const auth = require("../middleware/auth");

router.post("/",auth.auth([auth.roles.admin]),uploadFile.upload.single('avatar'),card.addCard)
router.get("/",card.getAllCards)
router.get("/getCard/:id",card.getCardWithId)
router.delete("/:id",auth.auth([auth.roles.admin]),card.deleteCard)
router.put("/:id",auth.auth([auth.roles.admin]),card.updateCard)
router.get("/count",card.getCount)
router.get("/getVistorsNumber/:id",card.getVistorsNumber)
router.post("/buyVouchersAndCards",card.buyVouchersAndCards)




module.exports =router