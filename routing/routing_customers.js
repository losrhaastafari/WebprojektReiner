import { customerOptions, getCustomerOptions } from "../schemas/customer.schema.js";
import { createCustomer, getCustomers } from "../customer.js";

async function CustomerRoutes(fastify, options) {
    fastify.post("/createCustomer", customerOptions, async (request, reply) => {
        const customerproperties = request.body;
        const customer = createCustomer(fastify, customerproperties);
        reply.code(201);
        return { customer: customer };
    });

    fastify.get("/getCustomers", getCustomerOptions, async (request, reply) => {
        const customers = getCustomers(fastify);
        if (!customers) {
            reply.code(500);
            return { error: "Could not get customers" };
        }
        return customers;
    });
}

export { CustomerRoutes };