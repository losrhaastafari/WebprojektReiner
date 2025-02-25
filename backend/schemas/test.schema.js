const generateTestDataSchema = {
    $id: "generateTestDataSchema",
    type: "object",
    properties: {
        message: { type: "string" },
        result: {
            type: "object",
            properties: {
                customers: { 
                    type: "array", 
                    items: { 
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            adress: { type: "string" },
                            phone: { type: "string" },
                            email: { type: "string" }
                        },
                        required: ["name", "adress", "phone", "email"]
                    }
                },
                offers: { 
                    type: "array", 
                    items: { 
                        type: "object",
                        properties: {
                            description: { type: "string" },
                            price: { type: "number" },
                            customer_id: { type: "integer" },
                            status: { type: "string" }
                        },
                        required: ["description", "price", "customer_id", "status"]
                    }
                }
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