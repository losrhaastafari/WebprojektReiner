import {createUser} from "../Function/users.js";
import {CreateUserSchema, UserSchema} from "../schemas/user.schema.js";

async function UserRoutes(fastify, options) {
    fastify.post("/createUser", CreateUserSchema, async (request, reply) => {
        const { username, password } = request.body;
        
        const userProperties = {
            username,
            password
        };
        
        const user = createUser(fastify, userProperties);
        reply.code(201);
        return { user: user };
    });
}

export { UserRoutes };