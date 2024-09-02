import {
  getEvent
} from "./chunk-TM3CZGDM.mjs";
import {
  registerForEvent
} from "./chunk-PNQAHFTL.mjs";
import {
  errorhandler
} from "./chunk-ERRK6BCR.mjs";
import {
  checkIn
} from "./chunk-THEPXTAD.mjs";
import {
  createEvent
} from "./chunk-CZGY4OQX.mjs";
import "./chunk-P2GV4LHW.mjs";
import {
  getAttendeeBadge
} from "./chunk-ZHCAMVXY.mjs";
import "./chunk-GCGUPGXB.mjs";
import {
  getEventAttendees
} from "./chunk-5XSJHEOG.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in API",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getEventAttendees);
app.register(getAttendeeBadge);
app.register(checkIn);
app.setErrorHandler(errorhandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server is running on port 3333");
});
