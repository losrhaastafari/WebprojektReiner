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
        status TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customerDB (id) ON DELETE CASCADE
    );
`;

const offerFiles = `
    CREATE TABLE IF NOT EXISTS offer_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        offer_id INTEGER NOT NULL,
        file_id TEXT NOT NULL UNIQUE,
        file_path TEXT NOT NULL,
        FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE
    );
`;

const offerComments = `
    CREATE TABLE IF NOT EXISTS offer_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        offer_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE
    );
`;

const userDB = `
    CREATE TABLE IF NOT EXISTS userDB (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
`;

function dbConnector(fastify, options, next) {
    const db = new Database(filePath);

    db.exec(customerDB);
    db.exec(offerDB);
    db.exec(offerFiles);
    db.exec(offerComments)
    db.exec(userDB);

    fastify.decorate("db", db)

    fastify.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    })

    next();
}

export default fp(dbConnector);