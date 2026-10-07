const express=require('express')

const {
    listTickets,
    getTicket,
    createTicket,
    updateTicket,
    updateTicketStatus,
    deleteTicket
}=require('../controllers/ticket.controller')

const {
    createTicketSchema,
    updateTicketSchema,
    statusSchema,
    validateBody,
    listTicketQuerySchema,
    validateQuery
}=require('../validators/ticket.validator')

const {authenticate,authorize}=require('../middleware/auth')

const router=express.Router()

router.use(authenticate)

router.get("/",validateQuery(listTicketQuerySchema),listTickets)

router.post("/",validateBody(createTicketSchema),createTicket)

router.get("/:ticketId",getTicket)

router.patch("/:ticketId",validateBody(updateTicketSchema),updateTicket)

router.patch("/:ticketId/status",validateBody(statusSchema),updateTicketStatus)

router.delete("/:ticketId",authorize('admin'),deleteTicket)

module.exports=router
