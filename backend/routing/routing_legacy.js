import { legacyOfferOptions } from "../schemas/legacy.schema.js";
import { transformAndSaveLegacyOffer } from "../Function/legacy.js";

async function LegacyRoutes(fastify, options) {
    fastify.post("/legacyOffer", legacyOfferOptions, async (request, reply) => {
        const legacyData = request.body;

        try {
            const newOffer = transformAndSaveLegacyOffer(fastify, legacyData);
            if (!newOffer) {
                return reply.code(500).send({ error: "Failed to transform and save legacy offer" });
            }
            return reply.code(201).send({ message: "Legacy offer transformed and saved successfully", newOffer });
        } catch (error) {
            fastify.log.error("Error while transforming and saving legacy offer:", error);
            return reply.code(500).send({ error: "Failed to transform and save legacy offer" });
        }
    });
}

export { LegacyRoutes };