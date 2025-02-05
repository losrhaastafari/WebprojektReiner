const offerSchema = {
    $id: "offerSchema",
    type: "object",
    properties: {
        description: { type: "string" },
        price: { type: "number" },
        customer_id: { type: "integer" },
        status: { type: "string" },
    },
};

//test

const offerOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                id: { type: "integer" },
                description: { type: "string" },
                price: { type: "number" },
                customer_id: { type: "integer" },
                status: { 
                    type: "string",
                    default: "Draft"  // Dokumentiert den Standardwert in der Validierung
                }
            },
            required: ["id", "description", "price", "customer_id", "status"],
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


const updateOfferOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                id: { type: "integer" },
                description: { type: "string" },
                price: { type: "number" },
                customer_id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    updatedOffer: { $ref: "offerSchema#" }
                }
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" }
                }
            },
            404: {
                type: "object",
                properties: {
                    error: { type: "string" }
                }
            }
        }
    }
};

const deleteOfferOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                id: { type: "integer" }
            },
            required: ["id"]
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" }
                }
            },
            404: {
                type: "object",
                properties: {
                    error: { type: "string" }
                }
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" }
                }
            }
        }
    }
};

export { offerSchema, offerOptions, updateOfferOptions, deleteOfferOptions };