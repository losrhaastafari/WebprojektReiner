const changeStatusSchema = {
    $id: "changeStatusSchema",
    type: "object",
    properties: {
        status: {
            type: "string",
        },
    },
};

const changeStatusOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                },
            },
            required: ["status"],  // Der Status ist erforderlich
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    status: { $ref: "changeStatusSchema#" },  // Verweis auf das changeStatusSchema
                },
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    message: { type: "string" },
                },
            },
            404: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
        },
    },
};

export { changeStatusSchema, changeStatusOptions };
