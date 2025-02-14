const legacyOfferSchema = {
    $id: "legacyOfferSchema",
    type: "object",
    properties: {
        xCreatedOn: { type: "string", format: "date-time" },
        xCreatedBy: { type: "string" },
        xSoftwareVersion: { type: "string" },
        xOffer: {
            type: "object",
            properties: {
                customerId: { type: "integer" },
                price: { type: "number" },
                currency: { type: "string" },
                state: { type: "string" },
                name: { type: "string" },
                hints: { type: "array", items: { type: "string" } }
            },
            required: ["customerId", "price", "currency", "state", "name"]
        }
    },
    required: ["xCreatedOn", "xCreatedBy", "xSoftwareVersion", "xOffer"]
};

const legacyOfferOptions = {
    schema: {
        body: legacyOfferSchema,
        response: {
            201: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    newOffer: { $ref: "offerSchema#" }
                }
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" }
                }
            }
        }
    }
};

export { legacyOfferSchema, legacyOfferOptions };