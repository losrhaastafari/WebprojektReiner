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

const offerFiles = `
    CREATE TABLE IF NOT EXISTS offer_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        offer_id INTEGER NOT NULL,
        file_id TEXT NOT NULL UNIQUE,
        file_path TEXT NOT NULL,
        FOREIGN KEY (offer_id) REFERENCES offer (id)
    );
`;

function dbConnector(fastify, options, next) {
    const db = new Database(filePath);

    db.exec(customerDB);
    db.exec(offerDB);
    db.exec(offerFiles);

    fastify.decorate("db", db)

    fastify.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    })

    next();
}

export default fp(dbConnector);