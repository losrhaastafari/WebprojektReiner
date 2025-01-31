/**
 * Offer
 * @param {Object} fastify
 * @param {Object} offerProperties
 * @param {string} offerProperties.description
 * @param {number} offerProperties.price
 * @param {number} offerProperties.customer_id
 * @returns {Object|null}
 */
export function createOffer(fastify, offerProperties) {
    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO offer (description, price, customer_id) VALUES (?, ?, ?)`
    );
    const selectStatement = fastify.db.prepare(
        `SELECT * from offer WHERE id=?`
    );

    const offerToCreate = {
        description: offerProperties.description,
        price: offerProperties.price,
        customer_id: offerProperties.customer_id,
    };

    try {
        const { description, price, customer_id } = offerToCreate;
        const info = insertIntoStatement.run(description, price, customer_id);
        const createdOffer = selectStatement.get(info.lastInsertRowid);
        return createdOffer;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

/**
 * Angebot aufrufen
 * @param {Object} fastify
 * @returns {Array|null}
 */
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