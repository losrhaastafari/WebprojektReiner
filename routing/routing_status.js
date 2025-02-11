import { changeStatusOptions } from "../schemas/status.schema.js";
import { updateOfferStatus } from "../Function/offer.js";
import { canModifyOffer } from "../OfferValidation/CanModifyOffer.js";

async function StatusRoutes(fastify, options) {
    fastify.patch("/:offer_id/status", changeStatusOptions, async (request, reply) => {
        const { offer_id } = request.params;
        const { status } = request.body;
        const { username, password } = request.headers;     //Änderung, auch bei updateStatus werden die Berechtiuungen nun validiert - 11.02.2025
        
        const updateStatuspermissionCheck = canModifyOffer(fastify, offer_id, username, password, "update_status", status)
        
        if (updateStatuspermissionCheck.status !==200) {
            return reply.code(updateStatuspermissionCheck.status).send({ error: updateStatuspermissionCheck.error })
        }
        
        const updatedOffer = updateOfferStatus(fastify, offer_id, status);

        return reply.code(200).send({ message: "Status updated successfully", updatedOffer });
    });
}

export { StatusRoutes };