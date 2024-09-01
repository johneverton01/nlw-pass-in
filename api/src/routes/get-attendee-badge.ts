import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function  getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
         200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURl: z.string().url(),
            }),
         }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    }, async (request, reply) => {
      const { attendeeId } = request.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            }
          }
        },
        where: { id: attendeeId },
      })

      if (attendee === null) {
        return reply.status(404).send({
          error: "Attendee not found",
        });
      }

      const baseURL = `${request.protocol}://${request.hostname}`

      const checkInURl = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

      return reply.send({ 
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURl: checkInURl.toString(),
        }
       })
    })
}