const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const healthRoutes=require('./routes/health.routes.js')
const ticketRoutes=require('./routes/ticket.routes.js')
const commentRoutes=require('./routes/comment.routes.js')

const notFound=require('./middleware/not-found.js')
const errorResponse=require('./middleware/error-response.js')

const app=express();

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/health',healthRoutes)
app.use('/api/v1/tickets',ticketRoutes)
app.use('/api/v1/tickets/:ticketId/comments', commentRoutes)

app.use(notFound)
app.use(errorResponse)

module.exports=app;