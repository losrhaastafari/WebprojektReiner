import { generateTestDataOptions } from "../schemas/test.schema.js";
import { generateTestData } from "../Function/test.js";

async function TestRoutes(fastify, options) {
    fastify.post("/generateTestData", generateTestDataOptions, async (request, reply) => {
        try {
            const result = generateTestData(fastify);
            return reply.code(201).send({ message: "Test data generated successfully", result });
        } catch (error) {
            fastify.log.error("Error while generating test data:", error);
            return reply.code(500).send({ error: "Failed to generate test data" });
        }
    });
}

export { TestRoutes };