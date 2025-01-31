import fp from "fastify-plugin";
import Database from "better-sqlite3";

const filePath ="./database/project.db";

const customerDB = `
    CREATE TABLE IF NOT EXISTS customerDB (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT null
    );
`;

const offerDB = `
    CREATE TABLE IF NOT EXISTS offer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        customer_id INTEGER NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customerDB (id) ON DELETE CASCADE
    );
`;

function dbConnector(fastify, options, next) {
    const db = new Database(filePath);

    db.exec(customerDB);
    db.exec(offerDB);

    fastify.decorate("db", db)

    fastify.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    })

    next();
}

export default fp(dbConnector);