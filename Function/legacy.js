import { v4 as uuidv4 } from "uuid";

export function transformAndSaveLegacyOffer(fastify, legacyData) {
    const { xCreatedOn, xCreatedBy, xSoftwareVersion, xOffer } = legacyData;
    const { customerId, price, currency, state, name, hints } = xOffer;

    const newOffer = {
        id: null, // SQLite wird die ID automatisch setzen (AUTOINCREMENT)
        description: name,
        price: price,
        customer_id: customerId,
        status: state
    };

    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO offer (description, price, customer_id, status) VALUES (?, ?, ?, ?)`
    );
    const selectLastInsertIdStatement = fastify.db.prepare(
        `SELECT * FROM offer WHERE id = last_insert_rowid()`
    );

    try {
        insertIntoStatement.run(newOffer.description, newOffer.price, newOffer.customer_id, newOffer.status);
        const createdOffer = selectLastInsertIdStatement.get();
        return createdOffer;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}