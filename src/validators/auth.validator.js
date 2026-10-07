const {z}=require('zod');

const registerSchema=z.object({
    email:z.string().trim().email("Invalid email format"),
    password:z.string().trim().min(8,"Password must be at least 8 characters long"),
    role:z.enum(["requester","agent","admin"]).optional(),
});

const loginSchema=z.object({
    email:z.string().trim().email("Invalid email format"),
    password:z.string().trim().min(1,"Password is required"),
});

function validateAuthBody(schema){
    return (req,res,next)=>{
        const result=schema.safeParse(req.body);

        if(!result.success){
            const isHtml=req.accepts(["json","html"])==="html";
            const firstError=result.error.issues[0]?.message||"Validation Error";

            if(isHtml){
                const view=req.path.includes("register")?"register":"login";

                return res.status(400).render(view,{error: firstError})
            }

            return res.status(400).json({
                success:false,
                error:{
                    statusCode:400,
                    message:"Validation Failed",
                    details: result.error.issues.map((issue)=>({
                        field:issue.path.join("."),
                        message:issue.message,
                    }))
                }
            })
        }

        req.body=result.data;
        next();
    };
}

module.exports={
    registerSchema,
    loginSchema,
    validateAuthBody,
};