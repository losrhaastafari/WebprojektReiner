const customerSchema = {
    $id: "customerSchema",
    type: "object",
    properties: {
        name: { type: "string" }
    },
};


const customerOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                id: {type: "integer"},
                name: {type: "string"},
            },
            required: ["id", "name"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    customer: { $ref: "customerSchema#"}
                }
            }
        }
    }
};


const getCustomerOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "customerSchema#"},
            },
        },
    },
}

const deleteCustomerOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
            404: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
        },
    },
};

export {customerOptions, customerSchema, getCustomerOptions, deleteCustomerOptions};

