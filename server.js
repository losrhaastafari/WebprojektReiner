import Fastify from "fastify";
import { CustomerRoutes } from "./routing/routing_customers.js";
import { customerSchema } from "./schemas/customer.schema.js";
import { offerSchema } from "./schemas/offer.schema.js";
import { OfferRoutes } from "./routing/routing_offers.js";
import dbConnector from "./database/database.js";

const fastify = Fastify({
    logger: true
});

fastify.addSchema(customerSchema);
fastify.register(CustomerRoutes, { prefix: "/Customer"})
fastify.register(dbConnector);
fastify.addSchema(offerSchema);
fastify.register(OfferRoutes, { prefix: "/Offer"});

try {
    await fastify.listen({ port: 8080});
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}