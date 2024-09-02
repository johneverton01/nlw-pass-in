import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequestError } from "./_errors/bad-request";

const REGISTER_FOR_EVENT_SCHEMA = z.object({
  name: z.string().min(4),
  email: z.string().email(),
});

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', {
      schema: {
        summary: "Register for an attendee",
        tags: ['Attendees'],
        body: REGISTER_FOR_EVENT_SCHEMA,
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          })
        },
      },
    }, 
    async (request, reply) => {
      const { name, email } = request.body;
      const { eventId } = request.params;

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: { id: eventId },
        }),
        prisma.attendee.count({
          where: {
            eventId,
          }
        })
      ])


      if (event === null) {
        throw new BadRequestError( "Event not found")
      }

      if (event.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
        throw new BadRequestError("The maximum number of attendees has been reached");
      }

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email,
          },
        }
      });

      if (attendeeFromEmail !== null) {
       throw new BadRequestError("E-mail already registered for this event")
      }



      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return reply.status(201).send({ attendeeId: attendee.id });
    })
}
