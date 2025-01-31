import { offerOptions, updateOfferOptions, deleteOfferOptions } from "../schemas/offer.schema.js";
import { createOffer, getOffers, updateOffer, deleteOffer } from "../offer.js";

async function OfferRoutes(fastify, options) {
    fastify.post("/createOffer", offerOptions, async (request, reply) => {
        const offerProperties = request.body;
        const offer = createOffer(fastify, offerProperties);
        reply.code(201);
        return { offer: offer };
    });

    fastify.get("/getOffers", async (request, reply) => {
        const offers = getOffers(fastify);
        if (!offers) {
            reply.code(500);
            return { error: "Could not get offers" };
        }
        return offers;
    });

    fastify.put("/updateOffer", updateOfferOptions, async (request, reply) => {
        const offerProperties = request.body;
        const updatedOffer = updateOffer(fastify, offerProperties);
        if (!updatedOffer) {
            reply.code(500);
            return { error: "Could not update offer" };
        }
        return { offer: updatedOffer };
    });

    fastify.delete("/deleteOffer", deleteOfferOptions, async (request, reply) => {
        const { id } = request.body;
        const result = deleteOffer(fastify, id);
        if (result.includes("not found")) { 
            return reply.code(404).send({ error: `Customer with ID ${id} not found.` });
        }
        if (!result) {
            reply.code(400);
            return { error: "Could not delete customer" };
        }
        return { message: result };
    });
}

export { OfferRoutes };