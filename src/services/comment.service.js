const AppError = require ('../middleware/error-handler')
const ticketRepository =require('../repositories/ticket.repository')
const commentRepository =require('../repositories/comment.repository')

function ensureTicketExists(ticketId){
    const ticket=ticketRepository.findById(ticketId)
    if(!ticket){
        throw new AppError(`Ticket ${ticketId} not found`,404)
    }
}

function getCommentOrThrow(ticketId,CommentId){
    const comment=commentRepository.findById(ticketId,CommentId)
    if(!comment){
        throw new AppError(`Comment ${CommentId} not found`,404)
    }
    return comment
}

function listComments(ticketId,query){
    ensureTicketExists(ticketId)
    return commentRepository.findAllByTicketId(ticketId,query)
}

function getComment(ticketId,commentId){
    ensureTicketExists(ticketId)
    return getCommentOrThrow(ticketId,commentId)
}

function createComment(ticketId,commentData){
    ensureTicketExists(ticketId)
    return commentRepository.create(ticketId,commentData)
}

function updateComment(ticketId,commentId,updates){
    ensureTicketExists(ticketId)
    getCommentOrThrow(ticketId,commentId)

    return commentRepository.update(ticketId,commentId,updates)
}

function deleteComment(ticketId,commentId){
    ensureTicketExists(ticketId)
    getCommentOrThrow(ticketId,commentId)

    commentRepository.remove(ticketId,commentId)
}

module.exports = {
  listComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};