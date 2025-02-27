const customerSchema = {
    $id: "customerSchema",
    type: "object",
    properties: {
        id: { type: "integer" },  // id wird vom System vergeben
        name: { type: "string" },
        adress: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
    },
    required: ["name", "adress", "phone", "email"],  // 'id' ist nicht erforderlich, weil sie vom System vergeben wird
};

const customerOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                adress: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
            },
            required: ["name", "adress", "phone", "email"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    customer: { $ref: "customerSchema#" }
                }
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    message: { "type": "string" },
                },
            }
        }
    }
};

const getCustomerOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "customerSchema#" },
            },
        },
    },
};

const updateCustomerOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                id: { type: "integer" },
                name: { type: "string" },
                adress: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
                updated_at: { type: "string", format: "date-time" },
            },
            required: ["id", "name", "adress", "phone", "email"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    updatedCustomer: { $ref: "customerSchema#" }
                },
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    message: { "type": "string" },
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

export { customerOptions, customerSchema, getCustomerOptions, deleteCustomerOptions, updateCustomerOptions };