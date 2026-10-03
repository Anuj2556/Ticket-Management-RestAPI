const { TICKET_STATUS } = require("../constants/ticket-status.js");

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

let nextId = 2;

function findAll({
  page = 1,
  limit = 10,
  status,
  priority,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  const filteredTickets = tickets
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
}

function findById(id) {
  const ticket = tickets.find((item) => item.id === id);
  return ticket ? { ...ticket } : null;
}

function create(ticketData) {
  const now = new Date().toISOString();
  const ticket = {
    id: `ticket-${nextId++}`,
    ...ticketData,
    createdAt: now,
    updatedAt: now,
  };

  tickets.push(ticket);
  return { ...ticket };
}

function update(id, updates) {
  const index = tickets.findIndex((ticket) => ticket.id === id);

  if (index === -1) {
    return null;
  }

  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return { ...tickets[index] };
}

function remove(id) {
  const index = tickets.findIndex((ticket) => ticket.id === id);

  if (index === -1) {
    return false;
  }

  tickets.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
