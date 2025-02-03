import { statusChange } from "../schemas/status.schema.js";
import { updateOfferStatus } from "../offer.js";

async function StatusRoutes(fastify, options) {
    fastify.patch("/:offer_id/status", statusChange, async (request, reply) => {
        const { offer_id } = request.params;
        const { status } = request.body;

        const validStatuses = ["Draft", "In Progress", "Active", "On Ice"];
        if (!validStatuses.includes(status)) {
            return reply.code(400).send({ error: "Invalid status" });
        }
        
        const updatedOffer = updateOfferStatus(fastify, offer_id, status);

        return reply.code(200).send({ message: "Status updated successfully", updatedOffer });
    });
}

export { StatusRoutes };