import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './routes/_errors/bad-request'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorhandler: FastifyErrorHandler = (error, request, reply) => {
  const { validation, validationContext } = error

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors,
    })
  }
  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }
  return reply.status(500).send({
    message: 'Internal server error',
  })
}