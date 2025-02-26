import { v4 as uuidv4 } from "uuid";
import { canModifyEntity } from "../OfferValidation/CanModifyEntity.js";


async function CommentRoutes(fastify, options) {
    fastify.post("/:offer_id/comments", async (request, reply) => {
        const { offer_id } = request.params;
        const { comment } = request.body;
        const { username, password} = request.headers;

        try {
            if (!offer_id || !comment) {
                return reply.code(400).send({ error: "Offer ID and comment are required" });
            }
            // Abruf der Status des Angebots für spezifische Berechtigungsprüfung abhängig vom Status des Angebotes

            const offer = fastify.db.prepare("SELECT status from offer WHERE id = ?").get(offer_id);
            if (!offer){
                return reply.code(404).send({error: "Offer not found"});
            }
            
            const canModify = canModifyEntity(fastify, username, password, "comment", "add_comment", offer.status);
            if (canModify.status !== 200) {
                return reply.code(canModify.status).send({ error: canModify.error });
            }
            
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
        //Hier fehlt die canModifyOffer() Funktion, soll diese ggf. noch eingebaut werden???
        const comments = fastify.db
            .prepare("SELECT id, comment, created_at FROM offer_comments WHERE offer_id = ?")
            .all(offer_id);

        if (!comments.length) {
            return reply.code(404).send({ error: "No comments found for this offer" });
        }

        return reply.code(200).send(comments);
    });

    //Route für das updaten eines Kommentars 
    fastify.put("/:offer_id/comments/:comment_id", async (request, reply) => {      
        const { offer_id, comment_id } = request.params;
        const { comment } = request.body;
        const { username, password } = request.headers;


        if (!comment) {
            return reply.code(400).send({ error: "Comment is required" });
        }

        const canModify = canModifyEntity(fastify, username, password, "comment", "update_comment");
        if (canModify.status !== 200) {
            return reply.code(canModify.status).send({ error: canModify.error });
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
        const { offer_id } = request.params;
        const { username, password } = request.headers;

        const canModify = canModifyEntity(fastify, offer_id, username, password, "comment", "delete_comment")
        if (canModify.status !== 200) {                                                 
            return reply.code(canModify.status).send({ error: canModify.error });
        }
        
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