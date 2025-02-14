export function generateTestData(fastify) {
    const customers = [];
    const offers = [];

    for (let i = 1; i <= 5; i++) {
        const customer = {
            name: `Customer ${i}`
        };
        const result = fastify.db.prepare(
            `INSERT INTO customerDB (name) VALUES (?)`
        ).run(customer.name);
        customer.id = result.lastInsertRowid;
        customers.push(customer);
    }

    for (let i = 1; i <= 10; i++) {
        const offer = {
            description: `Offer ${i}`,
            price: Math.floor(Math.random() * 10000) + 1000,
            customer_id: customers[Math.floor(Math.random() * customers.length)].id,
            status: "Draft"
        };
        const result = fastify.db.prepare(
            `INSERT INTO offer (description, price, customer_id, status) VALUES (?, ?, ?, ?)`
        ).run(offer.description, offer.price, offer.customer_id, offer.status);
        offer.id = result.lastInsertRowid;
        offers.push(offer);
    }

    return { customers, offers };
}