import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { CustomerRoutes } from "./routing/routing_customers.js"; // Korrigiere den Pfad hier
import { OfferRoutes } from "./routing/routing_offers.js";
import { FileRoutes } from "./routing/routing_files.js";
import dbConnector from "./database/database.js";
import { customerSchema } from "./schemas/customer.schema.js";
import { offerSchema } from "./schemas/offer.schema.js";

const fastify = Fastify({
    logger: true
});

fastify.register(fastifyMultipart);
fastify.addSchema(customerSchema);
fastify.register(CustomerRoutes, { prefix: "/Customer" });
fastify.register(dbConnector);
fastify.addSchema(offerSchema);
fastify.register(OfferRoutes, { prefix: "/Offer" });
fastify.register(FileRoutes, { prefix: "/Offer" });

try {
    await fastify.listen({ port: 8080 });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}