import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/generate-slug";

const EVENT_SCHEMA = z.object({
  title: z.string().min(4),
  details: z.string(),
  maximumAttendees: z.number().int().positive(),
});

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create a new event",
        tags: ['Events'],
        body: EVENT_SCHEMA,
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;

      const slug = generateSlug(title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: { slug },
      });

      if (eventWithSameSlug !== null) {
        return reply.status(409).send({
          error: "An event with the same title already exists",
        });
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      });

      return reply.status(201).send({ eventId: event.id });
    }
  );
}
