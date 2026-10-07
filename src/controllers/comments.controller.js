const commentService=require('../services/comment.service')

function listComments(req,res){
    const result=commentService.listComments(req.params.ticketId,req.query)

    res.status(200).json({
        success:true,
        data:result.data,
        pagination:result.pagination
    })
}

function getComment(req,res){
    const comment=commentService.getComment(req.params.ticketId,req.params.commentId)

    res.status(200).json({
        success:true,
        data:comment,
    })
}

function createComment(req,res){
const commentData={
    ...req.body,
    author:req.body.author||req.user.email
}
    
    const comment=commentService.createComment(req.params.ticketId,commentData)

    res.status(201).json({
        success:true,
        data:comment,
    })
}
function updateComment(req,res){
    const comment=commentService.updateComment(req.params.ticketId,req.params.commentId,req.body)

    res.status(200).json({
        success:true,
        data:comment,
    })
}
function deleteComment(req,res){
    commentService.deleteComment(req.params.ticketId,req.params.commentId)

    res.status(200).json({
        success:true,
        data:{
            message:"Comment Deleted Successfully"
        },
    })
}

module.exports={
  listComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};