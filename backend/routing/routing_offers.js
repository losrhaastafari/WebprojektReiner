import { offerOptions, updateOfferOptions, deleteOfferOptions, getOfferOptions } from "../schemas/offer.schema.js";
import { createOffer, getOfferById, updateOffer, deleteOffer } from "../Function/offer.js";
import { canModifyEntity } from "../OfferValidation/CanModifyEntity.js";

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
        const { username, password } = request.headers;
        
        //Berechtigungsprüfung
        const canModify = canModifyEntity(fastify, username, password, "offer", "create_offer")
        if (canModify.status !== 200) {
            return reply.code(canModify.status).send({ error: canModify.error });
        }

        const offer = createOffer(fastify, offerProperties);

        if(!offer){
            reply.code(404);
        }
        reply.code(201);
        return { offer: offer };
    });

    fastify.get("/getOffers", async (request, reply) => {
        // Extrahiere Filterparameter aus der Anfrage (query)
        const { name, description, price, status, customer_id } = request.query;
    
        // Zuerst alle Angebote abrufen, wenn keine Filter vorhanden sind
        let query = "SELECT * FROM offer WHERE 1=1"; // 1=1 ist eine triviale Bedingung, um die SQL-Logik zu vereinfachen
        const params = [];
    
        // Dynamische Filter hinzufügen, wenn sie in der Anfrage enthalten sind
    
        if (description) {
            query += " AND description LIKE ?";
            params.push(`%${description}%`);
        }
    
        if (price) {
            query += " AND price = ?";
            params.push(price);
        }
    
        if (status) {
            query += " AND status = ?";
            params.push(status);
        }
    
        if (customer_id) {
            query += " AND customer_id = ?";
            params.push(customer_id);
        }
    
        // Wenn keine Filter übergeben wurden, werden einfach alle Angebote zurückgegeben
        try {
            const offers = fastify.db.prepare(query).all(...params);
    
            if (offers.length === 0) {
                reply.code(404).send({ error: "No offers found matching the criteria" });
            } else {
                return offers; // Gibt entweder alle Angebote oder die gefilterten zurück
            }
        } catch (err) {
            reply.code(500).send({ error: "An error occurred while retrieving the offers" });
        }
    });

    fastify.get("/:offerId", async (request, reply) => {
        const { offerId } = request.params;

        const offer = getOfferById(fastify, offerId);

        if (offer.error) {
            return reply.code(404).send({ error: offer.error });
        }

        return reply.code(200).send(offer);
    });

    fastify.put("/updateOffer", updateOfferOptions, async (request, reply) => {
        const offerProperties = request.body;
        const updatedOffer = updateOffer(fastify, offerProperties);
        const { id } = request.body; //ggf entfernen
        const {username, password} = request.headers;

        
        //Fehlermeldung, falls keine Anmeldedaten übermittelt wurden!

        if (!username || !password) {
            return reply.code(401).send({ error: "Unauthorized: Missing credentials" });
        }
    
        //Berechtigungsprüfung
        const canModify = canModifyEntity(fastify, username, password, "offer", "update_offer");
        if (canModify.status !== 200) {                                                 
            return reply.code(canModify.status).send({ error: canModify.error });
        }
        
        if (!updatedOffer) {
            return reply.code(500).send({ error: "Could not update offer"});
        }

        return reply.code(200).send({
            message: "Offer successfully updated.",
            offer: updatedOffer
        })
    });

    fastify.delete("/deleteOffer", deleteOfferOptions, async (request, reply) => {
        const { id } = request.body;
        const { username, password } = request.headers;
        
        //Berechtigungsprüfung
        const canModify = canModifyEntity(fastify, username, password, "offer", "delete_offer")
        if (canModify.status !== 200) {
            return reply.code(canModify.status).send({error: canModify.error });
        }

        //Die Delete-Offer Funktion sollte erst dann aufgerufen werden sobald die Berechtigungsprüfung stattgefunden hat!
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