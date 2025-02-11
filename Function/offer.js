/** //Offer
 * @param {Object} offerProperties
 * @param {number} offerProperties.id
 * @param {string} offerProperties.description
 * @param {number} offerProperties.price
 * @param {number} offerProperties.customer_id
 * @param {string} offerProperties.status
 */

export function createOffer(fastify, offerProperties) {
    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO offer (id, description, price, customer_id, status) VALUES (?, ?, ?, ?, ?)`
    );
    const selectStatement = fastify.db.prepare(
        `SELECT * from offer WHERE id=?`
    );

    const offerToCreate = {
        id: offerProperties.id,
        description: offerProperties.description,
        price: offerProperties.price,
        customer_id: offerProperties.customer_id,
        status: offerProperties.status,
    };

    try {
        const { id, description, price, customer_id, status } = offerToCreate;
        const info = insertIntoStatement.run(id, description, price, customer_id, status);
        const createdOffer = selectStatement.get(info.lastInsertRowid);
        return createdOffer;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

export function getOffers(fastify) {
    const statement = fastify.db.prepare(`SELECT * from offer`);

    try {
        const offers = statement.all();
        return offers;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

export function updateOffer(fastify, offerProperties) {
    const { id, ...updateFields } = offerProperties;
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateFields);

    const statement = fastify.db.prepare(`UPDATE offer SET ${setClause} WHERE id = ?`);

    try {
        const result = statement.run(...values, id);
        
        if (result.changes > 0) {
            return { message: "Angebot erfolgreich aktualisiert!", id, ...offerProperties };
        } else {
            return { error: "Keine Änderungen vorgenommen oder Angebot nicht gefunden." };
        }
    } catch (error) {
        fastify.log.error(error);
        return { error: "Fehler beim Aktualisieren des Angebots." };
    }
}

export function deleteOffer(fastify, offer_id) {
    const statement = fastify.db.prepare(`DELETE FROM offer WHERE id = ?`);

    try {
        const info = statement.run(offer_id);
        return info.changes > 0 ? `Offer with ID ${offer_id} deleted.` : `Offer with ID ${offer_id} not found.`;
    } catch (error) {
        fastify.log.error(error);
        return `Error deleting offer with ID ${offer_id}.`;
    }
}

export function updateOfferStatus(fastify, offer_id, status) {
    const statement = fastify.db.prepare(`UPDATE offer SET status = ? WHERE id = ?`);

    try {
        statement.run(status, offer_id);
        return { id: offer_id, status };
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}
