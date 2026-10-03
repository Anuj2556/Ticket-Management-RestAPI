const express=require("express")

const commentController=require("../controllers/comments.controller")
const  {
  createCommentSchema,
  updateCommentSchema,
  validateBody,
  commentListQuerySchema,
  validateQuery
} =require('../validators/comment.validator')

const router = express.Router({mergeParams:true})


router.get("/",validateQuery(commentListQuerySchema),commentController.listComments)

router.get("/:commentId",commentController.getComment)

router.post("/",validateBody(createCommentSchema),commentController.createComment)

router.patch("/:commentId",validateBody(updateCommentSchema),commentController.updateComment)

router.delete("/:commentId",commentController.deleteComment)


module.exports=router