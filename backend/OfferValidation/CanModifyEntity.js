function canModifyEntity(fastify, username, password, entityType = "offer", actionType = null, status = null) {
    try {
        // Einlesen der Benutzerinformationen
        const user = fastify.db.prepare("SELECT username, password FROM userDB WHERE username = ? AND password = ?").get(username, password);
        
        if (!user) {
            return { status: 401, error: "Invalid Credentials" };   //Wird eigentlich nicht benötigt, da die Userrolle nur ausgewählt werden kann!
        }

        // Diese Berechtigung wird immer abgefragt, egal um welchen Entitätstypen es sich handelt! --> Sobald User angemeldet ist, kann dieser in den entsprechenden Routen, in denen die canModify Funktion aufgerufen wird, nichts unternehmen!
        if (user.username === "User") {
            return { status: 403, error: "Users cannot modify in general" };
        }
        // Berechtigungsprüfung für Entitätstyp "offer"
        if (entityType === "offer") {
            if (actionType === "update_status" && status && !["Draft", "Active", "In Progress", "On Ice"].includes(status)) {
                return { status: 400, error: "Invalid status provided. Allowed values: Draft, Active, In Progress, On Ice" };
            }
            if (actionType === "create_offer" && status && !["Draft", "Active", "In Progress", "On Ice"].includes(status)) {
                return { status: 400, error: "Invalid status provided. Allowed values: Draft, Active, In Progress, On Ice" };
            }
            // if (actionType === "create_offer") --> Berechtigungslogik für anlegen eines Angebots

        // Berechtigungsprüfung für Entitätstyp "comment"
        if (entityType === "comment") {
            if (actionType === "add_comment" && user.username === "Developer" && status === "Draft") {
                return { status: 403, error: "Developers cannot add comments to Draft offers" };
            }
            //if (actionType === "update_comment") --> spezifische Berechtigungslogik für das updaten eines comments
            //if (actionType === "delete_comment")
        }
            /*if (actionType === "delete_offer" && user.username === "user") {
                return { status: 403, error: "Users cannot delete Offers" };
            }*/

        //Berechtigungsprüfung für Entitätstyp "customer"
        
        /*if (entityType === "customer") {
            if (actionType === "create_customer")
            if (actionType === "update_customer")
        }*/
    }

        return { status: 200, allowed: true, message: "The entity can be successfully modified." };
    } catch (error) {
        fastify.log.error("Unexpected error in canModifyEntity:", error);
        return { status: 500, error: "Internal server error" };
    }
}

export { canModifyEntity };