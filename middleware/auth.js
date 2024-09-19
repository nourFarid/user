const jwt = require('jsonwebtoken')
const {PrismaClient}= require('@prisma/client')
const prisma= new PrismaClient()

const roles = {
    admin:"admin",
    user:"user"
}

Object.freeze(roles)


const auth =(roles = [])=>{
    return async (req, res, next) => {
        try {
            const { authorization} = req.headers;
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                return res.json({ message: "In-valid bearer key" })
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
            if (!token) {
                return res.json({ message: "In-valid token" })
            }
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            if (!decoded?.id) {
                return res.json({ message: "In-valid token payload" })
            }
            console.log('======decoded==============================');
            console.log(decoded);
            console.log('====================================');
            const authUser = await prisma.user.findUnique({
                where: { id: decoded.id }
            }) 
            
           
            console.log('=======auth user=============================');
            console.log(authUser);
            console.log(decoded.id);
            console.log('====================================');
            if (!authUser) {
                return res.json({ message: "Not registered account" })
            }
            if ( !roles.includes(authUser.role)){
                return res.json({ message: "you are not authorized" })

            }
            req.user = authUser;
            return next()
            } catch (error) {
                return res.json({ message: "Catch error" , err:error?.message })
            }
    }
}

module.exports = {auth, roles}