
export async function createPendingCredentialsTable(db){
    try {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS pending_credentials (
            user_id INTEGER PRIMARY KEY,
            new_email TEXT DEFAULT NULL,
            new_password TEXT DEFAULT NULL
            )`
        );
        console.log("Pending credentialss table created.");
    } catch (err) {
        console.error("Error creating table:", err.message);
    }
}
