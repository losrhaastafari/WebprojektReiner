import { customerOptions, getCustomerOptions, deleteCustomerOptions } from "../schemas/customer.schema.js";
import { createCustomer, deleteCustomer, getCustomers } from "../customer.js";

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

    fastify.delete("/deleteCustomer", deleteCustomerOptions, async (request, reply) => {
        const { id } = request.body;
        const result = deleteCustomer(fastify, id);
        if (result.includes("not found")) { 
            return reply.code(404).send({ error: `Customer with ID ${id} not found.` });
        }
        if (!result) {
            reply.code(400);
            return { error: "Could not delete customer" };
        }

    });
}

export { CustomerRoutes };