import { changeStatusOptions } from "../schemas/status.schema.js";
import { updateOfferStatus } from "../Function/offer.js";
import { canModifyEntity } from "../OfferValidation/CanModifyEntity.js";

async function StatusRoutes(fastify, options) {
    fastify.patch("/:offer_id/status", changeStatusOptions, async (request, reply) => {
        const { offer_id } = request.params;
        const { status } = request.body;
        const { username, password } = request.headers;     //Änderung, auch bei updateStatus werden die Berechtiungen nun validiert - 11.02.2025
        
        const canModify = canModifyEntity(fastify, username, password, "offer", "update_status", status);
        if (canModify.status !==200) {
            return reply.code(canModify.status).send({ error: canModify.error })
        }
        
        const updatedOffer = updateOfferStatus(fastify, offer_id, status);

        return reply.code(200).send({ message: "Status updated successfully", updatedOffer });
    });
}

export { StatusRoutes };