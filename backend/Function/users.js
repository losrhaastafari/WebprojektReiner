/** //User
 * @param {Object} userproperties
 * @param {string} username
 * @param {string} password
 */



export function createUser (fastify, userproperties) {
    const insertIntoStatement = fastify.db.prepare(
        `INSERT INTO userDB (username, password) VALUES (?, ?)`
    );

    const selectStatement = fastify.db.prepare(
        `SELECT * from userDB WHERE id=?`
    );

    const usertoCreate = {
        username: userproperties.username,
        password: userproperties.password,
    };

    try {
     const {username, password} = usertoCreate;
     const info = insertIntoStatement.run(username, password);

     const createdUser = selectStatement.get(info.lastInsertRowid);
     return createdUser;
    } catch (error) {
        fastify.log.error(error);
        return null;
    }
    
};