import { customerOptions, getCustomerOptions, deleteCustomerOptions, updateCustomerOptions } from "../schemas/customer.schema.js";
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from "../Function/customer.js";

async function CustomerRoutes(fastify, options) {
    fastify.post("/createCustomer", customerOptions, async (request, reply) => {
        const customerproperties = request.body;
        try {
            const result = createCustomer(fastify, customerproperties);
            if (result.error) {
                return reply.code(result.status).send({ error: result.error });
            }
            reply.code(result.status).send({ customer: result.customer });
        } catch (error) {
            fastify.log.error(error);
            reply.code(error.status).send({ error: error.error });
        }
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
        const result = updateCustomer(fastify, customerProperties);
    
        if (result.error) {
            return reply.code(result.status).send({ error: result.error });
        }
        return reply.code(result.status).send({ message: result.message, updatedCustomer: result.updatedCustomer });
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