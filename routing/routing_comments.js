import { v4 as uuidv4 } from "uuid";

async function CommentRoutes(fastify, options) {
    fastify.post("/:offer_id/comments", async (request, reply) => {
        const { offer_id } = request.params;
        const { comment } = request.body;

        if (!offer_id || !comment) {
            return reply.code(400).send({ error: "Offer ID and comment are required" });
        }

        const offerExists = fastify.db
            .prepare("SELECT id FROM offer WHERE id = ?")
            .get(offer_id);
        if (!offerExists) {
            return reply.code(404).send({ error: "Offer not found" });
        }

        try {
            fastify.db.prepare(
                "INSERT INTO offer_comments (offer_id, comment) VALUES (?, ?)"
            ).run(offer_id, comment);

            return reply.code(201).send({
                message: "Comment added successfully",
                offer_id,
                comment,
            });
        } catch (error) {
            fastify.log.error("Error while adding comment:", error);
            return reply.code(500).send({ error: "Failed to add comment" });
        }
    });

    fastify.get("/:offer_id/comments", async (request, reply) => {
        const { offer_id } = request.params;

        const comments = fastify.db
            .prepare("SELECT id, comment, created_at FROM offer_comments WHERE offer_id = ?")
            .all(offer_id);

        if (!comments.length) {
            return reply.code(404).send({ error: "No comments found for this offer" });
        }

        return reply.code(200).send(comments);
    });

    fastify.put("/:offer_id/comments/:comment_id", async (request, reply) => {
        const { offer_id, comment_id } = request.params;
        const { comment } = request.body;

        if (!comment) {
            return reply.code(400).send({ error: "Comment is required" });
        }

        const commentExists = fastify.db
            .prepare("SELECT id FROM offer_comments WHERE id = ? AND offer_id = ?")
            .get(comment_id, offer_id);
        if (!commentExists) {
            return reply.code(404).send({ error: "Comment not found" });
        }

        try {
            fastify.db.prepare(
                "UPDATE offer_comments SET comment = ? WHERE id = ? AND offer_id = ?"
            ).run(comment, comment_id, offer_id);

            return reply.code(200).send({
                message: "Comment updated successfully",
                comment_id,
                offer_id,
                comment,
            });
        } catch (error) {
            fastify.log.error("Error while updating comment:", error);
            return reply.code(500).send({ error: "Failed to update comment" });
        }
    });

    fastify.delete("/:offer_id/comments/:comment_id", async (request, reply) => {
        const { comment_id } = request.params;

        const result = fastify.db.prepare(
            "DELETE FROM offer_comments WHERE id = ?"
        ).run(comment_id);

        if (result.changes === 0) {
            return reply.code(404).send({ error: "Comment not found" });
        }

        return reply.code(200).send({ message: "Comment deleted" });
    });
}

export { CommentRoutes };