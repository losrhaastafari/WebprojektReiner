/** Offer
 * @param {Object} fastify
 * @param {Object} offerProperties
 * @param {number} offerProperties.id
 * @param {string} offerProperties.description
 * @param {number} offerProperties.price
 * @param {number} offerProperties.customer_id
 * @returns {Object|null}r
 */
export function createOffer(fastify, offerProperties) {
    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO offer (id, description, price, customer_id) VALUES (?, ?, ?, ?)`
    );
    const selectStatement = fastify.db.prepare(
        `SELECT * from offer WHERE id=?`
    );

    const offerToCreate = {
        id: offerProperties.id,
        description: offerProperties.description,
        price: offerProperties.price,
        customer_id: offerProperties.customer_id,
    };

    try {
        const { id, description, price, customer_id } = offerToCreate;
        const info = insertIntoStatement.run(id, description, price, customer_id);
        const createdOffer = selectStatement.get(info.lastInsertRowid);
        return createdOffer;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

/**
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

/**
 * @param {Object} fastify
 * @param {Object} offerProperties
 * @returns {Object|null}
 */
export function updateOffer(fastify, offerProperties) {
    const { id, ...updateFields } = offerProperties;
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateFields);

    const statement = fastify.db.prepare(`UPDATE offer SET ${setClause} WHERE id = ?`);

    try {
        statement.run(...values, id);
        return { id, ...offerProperties };
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}