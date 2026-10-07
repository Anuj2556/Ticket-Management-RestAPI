const jwt=require('jsonwebtoken')
const AppError=require('../middleware/error-handler')

function authenticate(req,res,next){
    try{
        let token=null;

        const authHeader=req.headers.authorization;
        if(authHeader && authHeader.toLowerCase().startsWith("bearer ")){
            token=authHeader.split(' ')[1]
        }else if(req.headers.cookie){
            const match=req.headers.cookie.match(/token=([^;]+)/)
                if(match){
                    token=match[1]
                }
        }
        if(!token){
            throw new AppError("Authentication Required : token missing",401)
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user={
            id:decode.sub||decode.id,
            email:decode.email,
            role:decode.role
        }

        next()

    }catch(err){
        if(err.name==="JsonWebTokenError" || err.name==="TokenExpiredError"){
            return next(new AppError("Authentication Required : Token Expired",401))
        }
        next(err)
    }
}

function authorize(...roles){
    return (req,res,next)=>{
        if(!req.user){
            return next(new AppError("Authentication Required",401))
        }
        if(roles.length>0 && !roles.includes(req.user.role)){
            return next(new AppError("Forbidden : insuffieciemnt permission",403))
        }
        next()
    }        
}

module.exports={
    authenticate,
    authorize
}