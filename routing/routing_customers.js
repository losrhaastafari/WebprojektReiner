import { customerOptions, getCustomerOptions, deleteCustomerOptions, updateCustomerOptions } from "../schemas/customer.schema.js";
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from "../Function/customer.js";

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

    fastify.put("/updateCustomer", updateCustomerOptions, async (request, reply) => {
        const customerProperties = request.body;
        const updatedCustomer = updateCustomer(fastify, customerProperties);
        if (!updatedCustomer) {
            reply.code(500);
            return { error: "Could not update customer" };
        }
        return { customer: updatedCustomer };
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
        return { message: result };
    });
}

export { CustomerRoutes };