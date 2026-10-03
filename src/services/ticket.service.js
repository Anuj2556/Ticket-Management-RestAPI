const AppError = require('../middleware/error-handler')
const {
    findAll,
    findById,
    create,
    update,
    remove,
} = require('../repositories/ticket.repository')



const { TICKET_STATUS, ALLOWED_STATUS_TRANSITIONS } = require('../constants/ticket-status')



function getTicketOrThrow(id) {
    const ticket = findById(id)
    if(!ticket){
        throw new AppError(`Ticket ${id} not Found`,404)
    }
    return ticket
}

function listTickets(query){
    return findAll(query)
}

function getTicket(id){
    return getTicketOrThrow(id)
}

function createTicket(ticketData){
    return create({
        ...ticketData,
        status:ticketData.status || TICKET_STATUS.OPEN
    });
}

function updateTicket(id,updates){
    getTicketOrThrow(id)
    if(updates.status!==undefined){
        throw new AppError(
            "Use the status endpoint to change ticket status",
            400
        )
    }
    return update(id,updates)
}

function transitionTicketStatus(id,nextStatus){
    const ticket=getTicketOrThrow(id)

    const allowedTransitions=ALLOWED_STATUS_TRANSITIONS[ticket.status] ||[]

    if(!allowedTransitions.includes(nextStatus)){
        throw new AppError(
            `Connot transition ticket from ${ticket.status} to ${nextStatus}`,
            400
        )
    }
    return update(id,{
        status:nextStatus
    })
}
function deleteTicket(id){
    getTicketOrThrow(id)
    remove(id)
}

module.exports={
    listTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    transitionTicketStatus
}