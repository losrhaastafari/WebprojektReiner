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
