const ticketService=require ('../services/ticket.service');


function listTickets(req,res){
    const result=ticketService.listTickets(req.query)

    res.status(200).json({
        success:true,
        data:result.data,
        pagination:result.pagination,
    });
}

function getTicket(req,res){
    const ticket=ticketService.getTicket(req.params.ticketId)

    res.status(200).json({
        success:true,
        data:ticket
    });
}

function createTicket(req,res){
    const ticket=ticketService.createTicket(req.body)

    res.status(201).json({
        success:true,
        data:ticket
    });
}

function updateTicket(req,res){
    const ticket=ticketService.updateTicket(req.params.ticketId,req.body)

    res.status(200).json({
        success:true,
        data:ticket
    });
}

function updateTicketStatus(req,res){
    const ticket=ticketService.transitionTicketStatus(req.params.ticketId,req.body.status)

    res.status(200).json({
        success:true,
        data:ticket
    });
}

function deleteTicket(req,res){
    ticketService.deleteTicket(req.params.ticketId)
    res.status(200).json({
        success:true,
        data:{
            message:"Ticket deleted successfully"
        }
    });
}

module.exports={
    listTickets,
    getTicket,
    createTicket,
    updateTicket,
    updateTicketStatus,
    deleteTicket
}