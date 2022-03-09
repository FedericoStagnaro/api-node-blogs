const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('========Request========')
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body', request.body)
    logger.info('-----------------------')
    next()
}

const unknowEndpoint = (request, response) => {
    response.status(404).send({ error: 'Ruta no encontrada' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error)

    if (error.name === 'Not Found') { response.status(404).json(error.message) }
    if (error.name === 'Content Missing') { response.status(400).json(error.message) }
    if (error.name === 'CastError') { response.status(400).json('Id malformated.') }
    if (error.name === 'ValidationError') {
        if (error.errors.username) { return response.status(400).json({ error: error.errors.username.message }) }
        if (error.errors.name) { return response.status(400).json({ error: error.errors.name.message }) }
        return response.status(400).json({ error: error })
    }
    next(error)
}
module.exports = { requestLogger, unknowEndpoint, errorHandler }
