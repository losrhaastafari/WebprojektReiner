export function generateTestData(fastify) {
    const customers = [];
    const offers = [];

    function getRandomPhone() {
        return `+49${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    }

    function getRandomEmail(i) {
        return `customer${i}@example.com`;
    }

    function getRandomAddress(i) {
        return `Street ${i}, City ${Math.floor(Math.random() * 100)}`;
    }

    try {
        fastify.log.info("Starting to generate test data...");

        for (let i = 1; i <= 5; i++) {
            const customer = {
                name: `Customer ${i}`,
                adress: getRandomAddress(i),
                phone: getRandomPhone(),
                email: getRandomEmail(i),
            };

            fastify.log.info(`Inserting customer: ${customer.name}`);
            const result = fastify.db.prepare(
                `INSERT INTO customerDB (name, adress, phone, email) VALUES (?, ?, ?, ?)`
            ).run(customer.name, customer.adress, customer.phone, customer.email);

            customer.id = result.lastInsertRowid;
            customers.push(customer);
            fastify.log.info(`Inserted customer with ID: ${customer.id}`);
        }

        for (let i = 1; i <= 10; i++) {
            const offer = {
                description: `Offer ${i}`,
                price: Math.floor(Math.random() * 10000) + 1000,
                customer_id: customers[Math.floor(Math.random() * customers.length)].id,
                status: "Draft"
            };

            fastify.log.info(`Inserting offer: ${offer.description} for customer ID: ${offer.customer_id}`);
            const result = fastify.db.prepare(
                `INSERT INTO offer (description, price, customer_id, status) VALUES (?, ?, ?, ?)`
            ).run(offer.description, offer.price, offer.customer_id, offer.status);

            offer.id = result.lastInsertRowid;
            offers.push(offer);
            fastify.log.info(`Inserted offer with ID: ${offer.id}`);
        }

        fastify.log.info("Test data generated successfully.");
        return { customers, offers };
    } catch (error) {
        fastify.log.error("Error while generating test data:", error);
        throw new Error(`Failed to generate test data: ${error.message}`);
    }
}