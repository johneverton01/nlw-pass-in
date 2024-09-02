import {
  generateSlug
} from "./chunk-P2GV4LHW.mjs";
import {
  BadRequestError
} from "./chunk-GCGUPGXB.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-event.ts
import z from "zod";
var EVENT_SCHEMA = z.object({
  title: z.string().min(4),
  details: z.string(),
  maximumAttendees: z.number().int().positive()
});
async function createEvent(app) {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Create a new event",
        tags: ["Events"],
        body: EVENT_SCHEMA,
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;
      const slug = generateSlug(title);
      const eventWithSameSlug = await prisma.event.findUnique({
        where: { slug }
      });
      if (eventWithSameSlug !== null) {
        throw new BadRequestError("An event with the same title already exists");
      }
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug
        }
      });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}

export {
  createEvent
};
