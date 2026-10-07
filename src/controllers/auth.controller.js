const authService=require('../services/auth.service');

function register(req,res,next){
    try{
        const {email,password}=req.body;
        const user = authService.register(email,password);

        const isHtml=req.accepts(["json","html"])==="html"
        if(isHtml){
            return res.redirect("/auth/login")
        }
        return res.status(201).json({
            success:true,
            data:user
        })
    }catch(err){
        const isHtml=req.accepts(["json","html"])==="html"
        if(isHtml){
            return res.status(err.statusCode || 400)
                .render("register",{
                    error:err.message,
                })
        }
        next(err)
    }
}


function login(req,res,next){
    try{
        const {email,password}=req.body;
        const result = authService.login(email,password);

        const isHtml=req.accepts(["json","html"])==="html"
        if(isHtml){
            res.cookie("token",result.token,{httpOnly:true})
            return res.redirect("/api/v1/tickets")
        }
        return res.status(201).json({
            success:true,
            data:result
        })
    }catch(err){
        const isHtml=req.accepts(["json","html"])==="html"
        if(isHtml){
            return res.status(err.statusCode || 400)
                .render("login",{
                    error:err.message,
                })
        }
        next(err)
    }
}

module.exports={
    register,
    login
}