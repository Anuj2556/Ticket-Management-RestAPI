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

let nextId = 2;

function findAllByTicketId(
  ticketId,
  {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = {}
) {
  const filteredComments = comments
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
  };
}

function findById(ticketId, commentId) {
  const comment = comments.find(
    (item) => item.ticketId === ticketId && item.id === commentId
  );

  return comment ? { ...comment } : null;
}

function create(ticketId, commentData) {
  const now = new Date().toISOString();
  const comment = {
    id: `comment-${nextId++}`,
    ticketId,
    ...commentData,
    createdAt: now,
    updatedAt: now,
  };

  comments.push(comment);
  return { ...comment };
}

function update(ticketId, commentId, updates) {
  const index = comments.findIndex(
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

  return { ...comments[index] };
}

function remove(ticketId, commentId) {
  const index = comments.findIndex(
    (comment) => comment.ticketId === ticketId && comment.id === commentId
  );

  if (index === -1) {
    return false;
  }

  comments.splice(index, 1);
  return true;
}

module.exports = {
  findAllByTicketId,
  findById,
  create,
  update,
  remove,
};
