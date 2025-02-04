const UserSchema = {
    $id: "UserSchema",
    type: "object",
    properties: {
        username: { type: "string" },
        password: { type: "string" },
    },
};

const CreateUserSchema = {
    schema: {
        body: {
            type: "object",
            properties: {
                username: { type: "string" },
                password: { type: "string" },
            },
            required: ["username", "password"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    user: { $ref: "UserSchema#" },
                },
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
        }
    }
}

export { UserSchema, CreateUserSchema };

//ggf. noch weitere http Fehlercodes abhändlen