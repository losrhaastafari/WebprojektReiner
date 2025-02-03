import { offerOptions, updateOfferOptions, deleteOfferOptions } from "../schemas/offer.schema.js";
import { createOffer, getOffers, updateOffer, deleteOffer } from "../Function/offer.js";

async function OfferRoutes(fastify, options) {
    fastify.post("/createOffer", offerOptions, async (request, reply) => {
        const { id, description, price, customer_id, status = "Draft" } = request.body;
        
        const offerProperties = {
            id,
            description,
            price,
            customer_id,
            status
        };
        
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
        const { id } = request.body;
        const {username, } = request.headers;

        const offer = fastify.db
        .prepare("SELECT status FROM offer WHERE id = ?")
        .get(id);

        if (offer.status === "On Ice") {
            return reply.code(400).send({ error: "Cannot update offers with Status 'On Ice'" });
        }
        else if (offer.status === "Active") {
            return reply.code(400).send({ error: "Cannot update offers with Status 'Active'" });
        }

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