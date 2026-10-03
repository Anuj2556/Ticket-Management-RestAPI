const TICKET_STATUS=Object.freeze({
    OPEN:"open",
    IN_PROGRESS:"in_progress",
    RESOLVED:"resolved",
    CLOSED:"closed",
})

const ALLOWED_STATUS_TRANSITIONS={
    open:["in_progress","closed"],
    in_progress:["resolved","closed"],
    resolved:["closed","open"],
    closed:[],
}


module.exports={
  TICKET_STATUS,
  ALLOWED_STATUS_TRANSITIONS,
}