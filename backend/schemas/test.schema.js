const generateTestDataSchema = {
    $id: "generateTestDataSchema",
    type: "object",
    properties: {
        message: { type: "string" },
        result: {
            type: "object",
            properties: {
                customers: { type: "array", items: { $ref: "customerSchema#" } },
                offers: { type: "array", items: { $ref: "offerSchema#" } }
            }
        }
    }
};

const generateTestDataOptions = {
    schema: {
        response: {
            201: generateTestDataSchema,
            500: {
                type: "object",
                properties: {
                    error: { type: "string" }
                }
            }
        }
    }
};

export { generateTestDataSchema, generateTestDataOptions };