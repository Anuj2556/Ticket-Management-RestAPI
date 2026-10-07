const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')

const AppError=require("../middleware/error-handler")
const userRepo=require('../repositories/user.repository')

function getJwtSecret(){
    if(!process.env.JWT_SECRET){
        throw new AppError("JWT_SECRET is not configured");
    }
    return process.env.JWT_SECRET;
}

function publicUser(user){
    return {
        id:user.id,
        email:user.email,
        role:user.role,
    }
}

function register(email,password){
    const existingUser=userRepo.findByEmail(email);

    if(existingUser){
        throw new AppError("Email is already registered",409)
    }
    const passwordHash=bcrypt.hashSync(password,12)

    const user=userRepo.create({
        email,
        passwordHash
    });

    return publicUser(user)
}

function login (email,password){
    const user=userRepo.findByEmail(email)

    if(!user ||!bcrypt.compareSync(password,user.passwordHash)){
        throw new AppError("Invalid email or password",401)
    }
    const token=jwt.sign(
        {
            sub:user.id,
            email:user.email,
            role:user.role,
        },
        getJwtSecret(),
        {
            expiresIn:process.env.JWT_EXPIRES_IN || "1d",
        }
    )
    return {
        user:publicUser(user),
        token,
    }
}

module.exports={
    login,
    register
}