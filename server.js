import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";

import { CustomerRoutes } from "./routing/routing_customers.js";
import { OfferRoutes } from "./routing/routing_offers.js";
import { FileRoutes } from "./routing/routing_files.js";
import { CommentRoutes } from "./routing/routing_comments.js";
import { StatusRoutes } from "./routing/routing_status.js";
import { UserRoutes } from "./routing/routing_users.js";

import dbConnector from "./database/database.js";

import { customerSchema } from "./schemas/customer.schema.js";
import { offerSchema } from "./schemas/offer.schema.js";
import { changeStatusSchema } from "./schemas/status.schema.js";
import { UserSchema } from "./schemas/user.schema.js";

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

fastify.register(dbConnector);

fastify.addSchema(customerSchema);
fastify.addSchema(offerSchema);
fastify.addSchema(changeStatusSchema);
fastify.addSchema(UserSchema);

fastify.register(CustomerRoutes, { prefix: "/Customer" });
fastify.register(OfferRoutes, { prefix: "/Offer" });
fastify.register(FileRoutes, { prefix: "/Offer" });
fastify.register(CommentRoutes, { prefix: "/Offer" });
fastify.register(StatusRoutes, { prefix: "/Offer" });
fastify.register(UserRoutes, { prefix: "/User" });


try {
    await fastify.listen({ port: 8080 });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}