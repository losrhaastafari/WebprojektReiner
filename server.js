import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { CustomerRoutes } from "./routing/routing_customers.js";
import { OfferRoutes } from "./routing/routing_offers.js";
import { FileRoutes } from "./routing/routing_files.js";
import { CommentRoutes } from "./routing/routing_comments.js";
import dbConnector from "./database/database.js";
import { customerSchema } from "./schemas/customer.schema.js";
import { offerSchema } from "./schemas/offer.schema.js";
import path from "path";

const fastify = Fastify({
    logger: true
});

fastify.register(fastifyMultipart);
fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), "assets"),
    prefix: "/assets/",
});
fastify.addSchema(customerSchema);
fastify.register(CustomerRoutes, { prefix: "/Customer" });
fastify.register(dbConnector);
fastify.addSchema(offerSchema);
fastify.register(OfferRoutes, { prefix: "/Offer" });
fastify.register(FileRoutes, { prefix: "/Offer" });
fastify.register(CommentRoutes, { prefix: "/Offer" });

try {
    await fastify.listen({ port: 8080 });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}