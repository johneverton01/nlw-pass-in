import {
  BadRequestError
} from "./chunk-GCGUPGXB.mjs";

// src/error-handler.ts
import { ZodError } from "zod";
var errorhandler = (error, request, reply) => {
  const { validation, validationContext } = error;
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message
    });
  }
  return reply.status(500).send({
    message: "Internal server error"
  });
};

export {
  errorhandler
};
