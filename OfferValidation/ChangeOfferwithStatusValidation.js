function canModifyOffer(fastify, offer_id) {
    const offer = fastify.db.prepare("SELECT status FROM offer WHERE id = ?").get(offer_id);
    //const validatedUser = fastify.db.prepare("SELECT username, password FROM")
    
    if (offer && offer.status === "On Ice") {
        return true;  // Angebot darf nicht bearbeitet werden
    }  
        return false; // Angebot kann bearbeitet
}

export {canModifyOffer};