const express =require('express');

const {login ,register}=require('../controllers/auth.controller');

const {
  registerSchema,
  loginSchema,
  validateAuthBody,
}=require('../validators/auth.validator')

const router=express.Router()

router.get("/login",(req,res)=>{
        res.render("login",{
            error:null,
        })
})
router.get("/register", (req, res) => {
  res.render("register", {
    error: null,
  });
});

router.post('/register',validateAuthBody(registerSchema),register);

router.post('/login',validateAuthBody(loginSchema),login)

module.exports = router;