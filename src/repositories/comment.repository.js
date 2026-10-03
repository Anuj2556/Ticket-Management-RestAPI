//---------FOR IN-MEMORY DATA-----------//
/*
const comments = [
  {
    id: "comment-1",
    ticketId: "ticket-1",
    author: "support@example.com",
    body: "We are investigating this issue.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 2;*/
//------------------------------------------------//

const db = require("../config/database");



//---------FOR DATABASE DATA -----------//

const sortColumns = {
    createdAt: "created_at",
    updatedAt: "updated_at",
    author: "author",
}

function mapComment(row) {
    if (!row) return null

    return {
        id: row.id,
        ticketId: row.ticket_id,
        author: row.author,
        body: row.body,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

function findAllByTicketId(
    ticketId,
    {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = {}
) {

    //---------FOR IN-MEMORY DATA-----------//

    /*const filteredComments = comments
    .filter((comment) => comment.ticketId === ticketId)
    .sort((firstComment, secondComment) => {
        const firstValue = String(firstComment[sortBy] ?? "");
        const secondValue = String(secondComment[sortBy] ?? "");
        const comparison = firstValue.localeCompare(secondValue);
      return sortOrder === "asc" ? comparison : -comparison;
      });
      
      const totalItems = filteredComments.length;
      const startIndex = (page - 1) * limit;
      
      return {
        data: filteredComments
        .slice(startIndex, startIndex + limit)
        .map((comment) => ({ ...comment })),
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            },
            };*/
    //------------------------------------------------//


    //---------FOR DATABASE DATA -----------//

    const column = sortColumns[sortBy] || "created_at"
    const direction = sortOrder === "asc" ? "ASC" : "DESC";

    const totalItems = db
        .prepare("SELECT COUNT(*) AS count FROM comments WHERE ticket_id=?")
        .get(ticketId).count;

    const rows = db
        .prepare(`
            SELECT * FROM comments 
            WHERE ticket_id=?
            ORDER BY ${column} ${direction}
            LIMIT ? OFFSET ?
            `)
        .all(ticketId, limit, (page - 1) * limit)

    return {
        data: rows.map(mapComment),
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit)
        }
    }

}

function findById(ticketId, commentId) {

    /*    const comment = comments.find(
            (item) => item.ticketId === ticketId && item.id === commentId
        );
    
        return comment ? { ...comment } : null;*/

    return mapComment(
        db.prepare("SELECT * FROM comments WHERE ticket_id=? AND id=?").get(ticketId, commentId)
    )
}

function create(ticketId, commentData) {

    const now = new Date().toISOString();
    const nextId = db
        .prepare(`
            SELECT COALESCE(
                MAX(CAST(SUBSTR(id, 9) AS INTEGER)),
                0
            ) + 1 AS nextId
            FROM comments
            WHERE id LIKE 'comment-%'
        `)
        .get().nextId;

        const comment = {
            id: `comment-${nextId}`,
        ticketId,
        ...commentData,
        createdAt: now,
        updatedAt: now,
    };

    // comments.push(comment);
    // return { ...comment };

    db.prepare(`
        INSERT INTO comments(
            id,
            ticket_id,
            author,
            body,
            created_at,
            updated_at
        )
        VALUES(
            @id,
            @ticketId,
            @author,
            @body,
            @createdAt,
            @updatedAt
        )
    `).run(comment)

    return comment
}

function update(ticketId, commentId, updates) {

    /*    const index = comments.findIndex(
            (comment) => comment.ticketId === ticketId && comment.id === commentId
        );
    
        if (index === -1) {
            return null;
        }
    
        comments[index] = {
            ...comments[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
    
        return { ...comments[index] };*/

    const fields = Object.keys(updates).filter((field) =>
        ["author", "body"].includes(field)
    )
    const assignment = fields.map(
        (field) => `${field}=@${field}`
    )
    db.prepare(`
        UPDATE comments
        SET ${assignment.join(",")},
            updated_at=@updatedAt
        WHERE ticket_id=@ticketId
            AND id=@id
        `).run({
        ...updates,
        ticketId,
        id: commentId,
        updatedAt: new Date().toISOString()
    })
    return findById(ticketId,commentId)
}

function remove(ticketId, commentId) {

/*    const index = comments.findIndex(
        (comment) => comment.ticketId === ticketId && comment.id === commentId
    );

    if (index === -1) {
        return false;
    }

    comments.splice(index, 1);
    return true;   */

    return (
        db.prepare(
            "DELETE FROM comments WHERE ticket_id=? AND id=?"
        ).run(ticketId,commentId).changes>0
    )
}

module.exports = {
    findAllByTicketId,
    findById,
    create,
    update,
    remove,
};
