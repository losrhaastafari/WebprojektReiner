import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fastifyMultipart from "@fastify/multipart";

async function FileRoutes(fastify, options) {
    const uploadDir = path.join(process.cwd(), "assets");

    await fs.mkdir(uploadDir, { recursive: true });

    fastify.post("/:offer_id/files", async (request, reply) => {
        const { offer_id } = request.params;

        if (!offer_id) {
            return reply.code(400).send({ error: "Offer ID is required" });
        }

        const offerExists = fastify.db
            .prepare("SELECT id FROM offer WHERE id = ?")
            .get(offer_id);
        if (!offerExists) {
            return reply.code(404).send({ error: "Offer not found" });
        }

        const data = await request.file();

        if (!data.filename.endsWith(".txt")) {
            return reply.code(400).send({ error: "Only .txt files are allowed" });
        }

        const fileId = uuidv4();
        const filePath = path.join(uploadDir, `${fileId}.txt`);

        try {
            await fs.writeFile(filePath, await data.toBuffer());

            fastify.db.prepare(
                "INSERT INTO offer_files (offer_id, file_id, file_path) VALUES (?, ?, ?)"
            ).run(offer_id, fileId, filePath);

            return reply.code(201).send({
                message: "File uploaded successfully",
                fileId,
                filePath,
            });
        } catch (error) {
            fastify.log.error("Error while saving file or updating DB:", error);
            return reply.code(500).send({ error: "Failed to upload file" });
        }
    });
}

export { FileRoutes };