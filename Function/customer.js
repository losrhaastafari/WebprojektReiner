/** //Customer
 * @param {Object} customerproperties
 * @param {string} customer.name
 * @param {string} customer.address
 * @param {string} customer.phone
 * @param {string} customer.email
 */

export function createCustomer(fastify, customerproperties) {
    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO customerDB (name, address, phone, email) VALUES (?, ?, ?, ?)`
    );
    const selectStatement = fastify.db.prepare(
        `SELECT * FROM customerDB WHERE id=?`
    );

    const { name, address, phone, email } = customerproperties;

    try {
        const info = insertIntoStatement.run(name, address, phone, email);
        const createdCustomer = selectStatement.get(info.lastInsertRowid);
        return createdCustomer;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

export function getCustomers(fastify) {
    const statement = fastify.db.prepare(`SELECT * FROM customerDB`);

    try {
        const customers = statement.all();
        return customers;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

export function updateCustomer(fastify, customerProperties) {
    const { id, ...updateFields } = customerProperties;

    // Nur Felder, die im Update enthalten sind, werden bearbeitet
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateFields);

    const statement = fastify.db.prepare(`UPDATE customerDB SET ${setClause} WHERE id = ?`);

    try {
        statement.run(...values, id);
        return { id, ...customerProperties };  // Gebe den aktualisierten Customer zurück
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

export function deleteCustomer(fastify, customer_id) {
    const statement = fastify.db.prepare(`DELETE FROM customerDB WHERE id = ?`);

    try {
        const info = statement.run(customer_id);
        return info.changes > 0
            ? `Customer with ID ${customer_id} deleted.`
            : `Customer with ID ${customer_id} not found.`;
    } catch (error) {
        fastify.log.error(error);
        return `Error deleting customer with ID ${customer_id}.`;
    }
}
