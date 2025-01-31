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

export {customerOptions, customerSchema, getCustomerOptions};

