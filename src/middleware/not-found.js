const AppError = require("./error-handler")

function notFound(req, res, next) {
    next(
        new AppError(
            `Route ${req.method} ${req.originalUrl} not found`,
            404
        )
    )
}
module.exports = notFound