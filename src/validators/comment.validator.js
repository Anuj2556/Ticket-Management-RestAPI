const { z } = require('zod')

const createCommentSchema = z.object({
    author: z.string().email(),
    body: z.string().trim().min(1).max(2000)
})

const updateCommentSchema = createCommentSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field is required",
        }
    )


function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: {
                    statusCode: 400,
                    message: "Validation Failed",
                    details: result.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    }))
                }
            })
        }
        req.body = result.data
        next()
    }
}

const commentListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.enum(["createdAt", "updatedAt", "author"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query)
        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: {
                    statusCode: 400,
                    message: "Validation Failed",
                    details: result.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                }
            })
        }
        req.query = result.data;
        next()
    }
}

module.exports = {
    createCommentSchema,
    updateCommentSchema,
    validateBody,
    commentListQuerySchema,
    validateQuery,
};