/** //Customer
 * @param {Object} customerproperties
 * @param {integer} customer.id
 * @param {string} customer.name
 */


export function createCustomer(fastify, customerproperties) {
    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO customerDB (id, name) VALUES (?, ?)`
    );
    const selectStatement = fastify.db.prepare(
        `SELECT * from customerDB WHERE id=?`
    );

    const customertoCreate = {
        id: customerproperties.id,
        name: customerproperties.name,
    };

    try {
     const {id, name } = customertoCreate;
     const info = insertIntoStatement.run(id, name);

     const createdCustomer = selectStatement.get(info.lastInsertRowid);
     return createdCustomer;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
}

export function getCustomers (fastify) {
     const statement = fastify.db.prepare(`SELECT * from customerDB`);

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
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
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
        return info.changes > 0 ? `Customer with ID ${customer_id} deleted.` : `Customer with ID ${customer_id} not found.`;
    } catch (error) {
        fastify.log.error(error);
        return `Error deleting customer with ID ${customer_id}.`;
    }
}
