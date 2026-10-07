const db =require("../config/database")

function mapUser(row){
    if(!row) return null

    return {
        id:row.id,
        email:row.email,
        passwordHash:row.password_hash,
        role:row.role,
        createdAt:row.created_at,
        updatedAt:row.updated_at,
    };
}

function findByEmail(email){
    const row=db
        .prepare("SELECT * FROM users WHERE email=?")
        .get(email.toLowerCase())

    return mapUser(row)
}

function findById(id){
    const row=db
        .prepare("SELECT * FROM users WHERE id=?")
        .get(id)

    return mapUser(row)
}

function create({email,passwordHash,role="requester"}){
    const now=new Date().toISOString()

    const user={
        id:`user-${Date.now()}`,
        email:email.toLowerCase(),
        passwordHash,
        role,
        createdAt:now,
        updatedAt:now,
    }

    db.prepare(`
        INSERT INTO users (
            id,
            email,
            password_hash,
            role,
            created_at,
            updated_at
        )
        VALUES (
            @id,
            @email,
            @passwordHash,
            @role,
            @createdAt,
            @updatedAt
        )
    `).run(user)

    return user;
}


module.exports={
    findByEmail,
    findById,
    create
}