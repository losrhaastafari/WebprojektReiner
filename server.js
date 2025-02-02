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
import cors from '@fastify/cors';


const fastify = Fastify({
    logger: true
});

fastify.register(fastifyMultipart);
fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), "assets"),
    prefix: "/assets/",
});

//CORS integration for Frontend Deployment

fastify.register(cors, {
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback (new Error('Not allowed by CORS'));
        }
    }
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