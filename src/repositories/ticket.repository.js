const { TICKET_STATUS } = require("../constants/ticket-status.js");
const db = require("../config/database.js")


/*
//---------FOR IN-MEMORY DATA-----------//
const tickets = [
  {
    id: "ticket-1",
    title: "Cannot log in",
    description: "The login page rejects valid credentials.",
    status: TICKET_STATUS.OPEN,
    priority: "high",
    requester: "anuj@example.com",
    assignee: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
let nextId = 2;*/


//---------FOR DATABASE DATA USING SQLITE-----------//

const sortColumns = {
    createdAt: "created_at",
    updatedAt: "updated_at",
    title: "title",
    priority: "priority",
    status: "status",
}

function mapTicket(row) {
    if (!row) return null

    return {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        requester: row.requester,
        assignee: row.assignee,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

//--------- MAIN FUNCTIONS -----------//


function findAll({
    page = 1,
    limit = 10,
    status,
    priority,
    sortBy = "createdAt",
    sortOrder = "desc",
} = {}) {
    //---------FOR IN-MEMORY DATA-----------//

    /*    const filteredTickets = tickets
            .filter((ticket) => (!status || ticket.status === status) && (!priority || ticket.priority === priority))
            .sort((firstTicket, secondTicket) => {
                    const firstValue = String(firstTicket[sortBy] ?? "");
                    const secondValue = String(secondTicket[sortBy] ?? "");
                    const comparison = firstValue.localeCompare(secondValue);
                    return sortOrder === "asc" ? comparison : -comparison;
                });
            const totalItems = filteredTickets.length;
            const startIndex = (page - 1) * limit;
            return {
                data: filteredTickets
                    .slice(startIndex, startIndex + limit)
                    .map((ticket) => ({ ...ticket })),
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                },
            };
    */


    //--------- FOR DATABASE DATA -----------//

    const filters = [];
    const values = {};

    if (status) {
        filters.push("status=@status");
        values.status = status;
    }
    if (priority) {
        filters.push("priority=@priority");
        values.priority = priority;
    }
    const where = filters.length
        ? `WHERE ${filters.join(" AND ")}`
        : "";
    const orderColumn = sortColumns[sortBy] || "created_at";
    const orderDirection = sortOrder === "asc" ? "ASC" : "DESC";

    const totalItems = db
        .prepare(`SELECT COUNT(*) AS count FROM tickets ${where}`)
        .get(values).count;

    const row = db
        .prepare(`
            SELECT * FROM tickets ${where}
            ORDER BY ${orderColumn} ${orderDirection}
            LIMIT @limit OFFSET @offset
            `)
        .all({
            ...values,
            limit,
            offset: (page - 1) * limit
        });

    return {
        data: row.map(mapTicket),
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
        },
    }
}


function findById(id) {
    //---------FOR IN-MEMORY DATA-----------//

    // const ticket = tickets.find((item) => item.id === id);
    // return ticket ? { ...ticket } : null;
    //---------------------------------------------------------------//

    //---------FOR DATABASE DATA -----------//

    return mapTicket(
        db.prepare("SELECT * FROM tickets WHERE id=?").get(id)
    )
}

function create(ticketData) {

    const now = new Date().toISOString();
    const nextId = db
        .prepare(`
            SELECT COALESCE(
                MAX(CAST(SUBSTR(id, 8) AS INTEGER)),
                0
            ) + 1 AS nextId
            FROM tickets
            WHERE id LIKE 'ticket-%'
        `)
        .get().nextId;

        const ticket = {
            id: `ticket-${nextId}`,
        ...ticketData,
        createdAt: now,
        updatedAt: now,
    };

    //---------FOR IN-MEMORY DATA-----------//
    // tickets.push(ticket);
    // return { ...ticket };
    //----------------------------------------------------//

    //---------FOR DATABASE DATA -----------//
    db.prepare(`
        INSERT INTO tickets (
            id,
            title,
            description,
            status,
            priority,
            requester,
            assignee,
            created_at,
            updated_at
        )
        VALUES (
            @id,
            @title,
            @description,
            @status,
            @priority,
            @requester,
            @assignee,
            @createdAt,
            @updatedAt
        )
        `).run(ticket)
    return ticket
}

function update(id, updates) {
    //---------FOR IN-MEMORY DATA-----------//

    //     const index = tickets.findIndex((ticket) => ticket.id === id);

    //     if (index === -1) {
    //         return null;
    //     }

    //     tickets[index] = {
    //         ...tickets[index],
    //         ...updates,
    //         updatedAt: new Date().toISOString(),
    //     };

    //     return { ...tickets[index] };
    //------------------------------------------------//


    //---------FOR DATABASE DATA -----------//

    const allowedFields = [
        "title",
        "description",
        "status",
        "priority",
        "requester",
        "assignee",
    ]
    const fields = Object.keys(updates).filter((field) =>
        allowedFields.includes(field)
    )
    if (fields.length === 0) {
        return findById(id)
    }
    const assignments = fields.map(
        (field) => `${field}=@${field}`
    )
    db.prepare(`
        UPDATE tickets
        SET ${assignments.join(",")},
            updated_at=@updatedAt
        WHERE id=@id 
        `).run({
        ...updates,
        id,
        updatedAt: new Date().toISOString()
    })
    return findById(id)
}

function remove(id) {
    //---------FOR IN-MEMORY DATA-----------//

    // const index = tickets.findIndex((ticket) => ticket.id === id);

    // if (index === -1) {
    //     return false;
    // }

    // tickets.splice(index, 1);
    // return true;
    //------------------------------------------------//


    //---------FOR DATABASE DATA -----------//
    return (
        db.prepare("DELETE FROM tickets WHERE id=?").run(id)
            .changes > 0
    )
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};
