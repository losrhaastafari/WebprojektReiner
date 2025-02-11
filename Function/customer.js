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
        `SELECT * FROM customerDB WHERE phone=? OR email=?`
    );

    const { name, adress, phone, email } = customerproperties;

    try {
        const duplicateCustomer = checkDuplicateStatement.get(phone, email);
        if (duplicateCustomer) {
            return { status: 400, error: "Customer with the same phone number, or email already exists." }; // 400 Bad Request
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

    if (!id) {
        return { status: 400, error: "ID is required." };
    }

    // Sicherstellen, dass updated_at explizit aktualisiert wird
    updateFields.updated_at = new Date().toISOString();

    const setClause = Object.keys(updateFields)
        .map(key => `${key} = ?`)
        .join(', ');

    const values = Object.values(updateFields);
    values.push(id);

    const statement = fastify.db.prepare(`UPDATE customerDB SET ${setClause} WHERE id = ?`);

    try {
        const result = statement.run(...values);

        if (result.changes > 0) {
            return { status: 200, message: "Kunde erfolgreich aktualisiert!", updatedCustomer: customerProperties };
        } else {
            return { status: 404, error: "Kunde nicht gefunden oder keine Änderungen vorgenommen." };
        }
    } catch (error) {
        fastify.log.error(error);
        return { status: 500, error: "Fehler beim Aktualisieren des Kunden." };
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
