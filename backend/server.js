import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { CustomerRoutes } from "./routing/routing_customers.js";
import { OfferRoutes } from "./routing/routing_offers.js";
import { FileRoutes } from "./routing/routing_files.js";
import { CommentRoutes } from "./routing/routing_comments.js";
import { StatusRoutes } from "./routing/routing_status.js";
import { UserRoutes } from "./routing/routing_users.js";
import { LegacyRoutes } from "./routing/routing_legacy.js";
import { TestRoutes } from "./routing/routing_test.js";
import dbConnector from "./database/database.js";
import { customerSchema } from "./schemas/customer.schema.js";
import { offerSchema } from "./schemas/offer.schema.js";
import { legacyOfferSchema } from "./schemas/legacy.schema.js";
import { changeStatusSchema } from "./schemas/status.schema.js";
import { generateTestDataSchema } from "./schemas/test.schema.js";
import { UserSchema } from "./schemas/user.schema.js";
import path from "path";
import cors from "@fastify/cors";

// Fastify-Instanz erstellen
const fastify = Fastify({
    logger: true // ✅ Logging aktiviert für Debugging
});

// Multipart & Static Files registrieren
fastify.register(fastifyMultipart);
fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), "assets"),
    prefix: "/assets/",
});


fastify.register(cors, {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
});

fastify.addHook("onRequest", (request, reply, done) => {
    console.log(`🌍 Incoming request: ${request.method} ${request.url} from ${request.headers.origin}`);
    done();
});

fastify.addSchema(customerSchema);
fastify.addSchema(offerSchema);
fastify.addSchema(legacyOfferSchema);
fastify.addSchema(changeStatusSchema);
fastify.addSchema(UserSchema);
fastify.addSchema(generateTestDataSchema);

fastify.register(dbConnector);
fastify.register(CustomerRoutes, { prefix: "/Customer" });
fastify.register(OfferRoutes, { prefix: "/Offer" });
fastify.register(FileRoutes, { prefix: "/Offer" });
fastify.register(CommentRoutes, { prefix: "/Offer" });
fastify.register(StatusRoutes, { prefix: "/Offer" });
fastify.register(LegacyRoutes, { prefix: "/Legacy" });
fastify.register(UserRoutes, { prefix: "/User" });
fastify.register(TestRoutes, { prefix: "/Test" });

try {
    await fastify.listen({ port: 8080, host: "localhost" });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}