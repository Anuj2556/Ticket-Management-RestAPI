const { TICKET_STATUS } = require('../constants/ticket-status')
const { z } = require('zod')

const createTicketSchema = z.object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(5000),
    priority: z.enum(["low", "medium", "high"]),
    requester: z.string().email(),
    assignee: z.string().email().nullable().optional()
})

const updateTicketSchema = createTicketSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required",
    })

const statusSchema = z.object({
    status: z.enum(Object.values(TICKET_STATUS))
})

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
                        message: issue.message
                    }))
                }
            })
        }
        req.body = result.data;
        next()
    }
}

const listTicketQuerySchema=z.object({
    page:z.coerce.number().int().min(1).default(1),
    limit:z.coerce.number().int().min(1).max(100).default(10),
    status:z.enum(Object.values(TICKET_STATUS)).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    sortBy: z
            .enum(["createdAt","updatedAt","title","priority","status"])
            .default("createdAt"),
    sortOrder:z.enum(["asc","desc"]).default("desc")
})

function validateQuery(schema){
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
        req.body = result.data;
        next()
    }
}

module.exports = {
    createTicketSchema,
    updateTicketSchema,
    statusSchema,
    validateBody,
    listTicketQuerySchema,
    validateQuery
};