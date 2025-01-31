const offerSchema = {
    $id: "offerSchema",
    type: "object",
    properties: {
        description: { type: "string" },
        price: { type: "number" },
        customer_id: { type: "integer" }
    },
};

const offerOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                id: { type: "integer" },
                description: { type: "string" },
                price: { type: "number" },
                customer_id: { type: "integer" },
            },
            required: ["id", "description", "price", "customer_id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    offer: { $ref: "offerSchema#" }
                }
            }
        }
    }
};

export { offerSchema, offerOptions };