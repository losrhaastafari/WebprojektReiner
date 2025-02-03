const statusChange = {
    schema: {
        body: {
            type: "object",
            properties: {
                status: {type: "string"},
            },
            status: {
                type: "string",
                enum: ["Draft", "In Progress", "Active", "On Ice"]
            }
        },
        response: {
            200: {
                type: "object",
                properties: {
                    status: { type: "string"},
                }
            }
        }
    }
}

export {statusChange};