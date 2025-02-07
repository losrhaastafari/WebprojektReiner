/** //Customer
 * @param {Object} customerproperties
 * @param {integer} customer.id
 * @param {string} customer.name
 * @param {string} customer.adress
 * @param {string} customer.phone
 * @param {string} customer.email
 * @param {string} customer.updated_at
 */

export function createCustomer(fastify, customerproperties) {
    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO customerDB (name, adress, phone, email) VALUES (?, ?, ?, ?)`
    );
    const selectStatement = fastify.db.prepare(
        `SELECT * FROM customerDB WHERE id=?`
    );

    const checkDuplicateStatement = fastify.db.prepare(
        `SELECT * FROM customerDB WHERE name=? OR phone=? OR email=?`
    );

    const { name, adress, phone, email } = customerproperties;

    try {
        const duplicateCustomer = checkDuplicateStatement.get(name, phone, email);
        if (duplicateCustomer) {
            return { status: 400, error: "Customer with the same name, phone number, or email already exists." }; // 409 Conflict
        }
        const info = insertIntoStatement.run(name, adress, phone, email);
        const createdCustomer = selectStatement.get(info.lastInsertRowid);
        return { status: 201, customer: createdCustomer }; // 201 Created
    } catch (error) {
        fastify.log.error(error);
        return { status: 500, error: "An error occurred while creating the customer." }; // 500 Internal Server Error
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

    if (!customerProperties.id) {
        return fastify.reply.status(400).send({ error: "ID is required." });
    }
    console.log("Test");
    // Set updated_at auf aktuellen SQLite-Timestamp
    const setClause = Object.keys(updateFields)
        .map(key => `${key} = ?`)
        .concat(["updated_at = datetime('now')"]) // Aktualisierung des Zeitstempels
        .join(', ');

    const values = Object.values(updateFields);

    const statement = fastify.db.prepare(`UPDATE customerDB SET ${setClause} WHERE id = ?`);

    try {
        statement.run(...values, id);
        return { id, ...customerProperties };
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
