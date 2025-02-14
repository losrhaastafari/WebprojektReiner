function canModifyOffer(fastify, offer_id, username, password, actionType = null, status = null) {
    // Holen des Angebotsstatus
    const offer = fastify.db.prepare("SELECT status FROM offer WHERE id = ?").get(offer_id);

    try {
    //''''''''''Fehlerhandling Offer'''''''''''''''
    // Angebot mit Status "On Ice" kann weder über Route /Offer/updateOffer noch /Offer/:offer_id/status bearbeitet werden
    
    //Wenn das Angebot nicht existiert wird eine entsprechende Fehlermeldung ausgegeben
    if (!offer) {
        return { status: 404, error: "Offer not found"};
    }
    if (["add_comment", "update_status", "update_offer"].includes(actionType) && offer.status === "On Ice") {
            return { status: 403, error: "Offer is frozen and cannot be modified." };
    }

    //''''''''''Fehlerhandling-BerechtigungenUser'''''''''''''''
    // Benutzer aus der Datenbank abrufen
    const user = fastify.db.prepare("SELECT username, password FROM userDB WHERE username = ? AND password = ?").get(username, password);
    
    if (!user) {
        return { status: 401, error: "Invalid Credentials"};           // Falls der Benutzer nicht existiert oder falsche Zugangsdaten hat
    }
    if (user.username === "user") {                                    //user dürfen generell keine Änderungen an Angeboten vornehmen!
        return { status: 403, error: "Users cannot modify offers in general"}
    }
    
    
    //''''''''''Fehlerhandling-Offer_Status_Update'''''''''''''''
    //Überprüfung, ob einer der richtigen Status im Body mitgegeben wurde
    const validStatus = ["Draft", "Active", "In Progress", "On Ice"];

    if (actionType === "update_status" && status && !validStatus.includes(status)) {
       return { status: 400, error: "Invalid status provided. Allowed values: Draft, Active, In Progress, On Ice" };
    }
   
    
    //''''''''''''Fehlerhandling Offer-_hinzufügen_von_Kommentaren'''''''''''''
    // Entwickler dürfen keine Kommentare für "Draft"-Angeboten erstellen
    if (actionType === "add_comment" && user.username === "developer" && offer.status === "Draft") {
        return { status: 403, error: "Developers cannot add comments to Draft offers." };
    }

    return { 
        status: 200, 
        allowed: true, 
        message: "The offer has been successfully modified." 
    };

    } catch (error) {
    fastify.log.error("Unexpected error in canModifyOffer:", error);
    return { status: 500, error: "Internal server error" };
    };
};

export {canModifyOffer}