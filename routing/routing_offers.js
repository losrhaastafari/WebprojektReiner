import { offerOptions, updateOfferOptions } from "../schemas/offer.schema.js";
import { createOffer, getOffers, updateOffer } from "../offer.js";

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
}

export { OfferRoutes };