import { changeStatusOptions } from "../schemas/status.schema.js";
import { updateOfferStatus } from "../Function/offer.js";
import { canModifyOffer } from "../OfferValidation/ChangeOfferwithStatusValidation.js";

async function StatusRoutes(fastify, options) {
    fastify.patch("/:offer_id/status", changeStatusOptions, async (request, reply) => {
        const { offer_id } = request.params;
        const { status } = request.body;

        const validatedOffer = canModifyOffer(fastify, offer_id)
        
        const validStatuses = ["Draft", "In Progress", "Active", "On Ice"];

        if (!validStatuses.includes(status)) {
            return reply.code(400).send({ error: "Invalid status" });
        }

        if (validatedOffer) {
            return reply.code(404).send ({ error: "Cannot update Offer with Status 'On Ice'"})
        }

        
        const updatedOffer = updateOfferStatus(fastify, offer_id, status);

        return reply.code(200).send({ message: "Status updated successfully", updatedOffer });
    });
}

export { StatusRoutes };