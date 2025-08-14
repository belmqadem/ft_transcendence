
export async function createOAuthIdentityTable(db){
    try {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS oauth_identity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            provider TEXT NOT NULL CHECK(provider IN ('google', '42')),
            provider_sub TEXT NOT NULL UNIQUE,
            email TEXT,
            access_token TEXT,
            refresh_token TEXT,
            linked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
            )`
        );
        console.log("OAuth identity table created.");
    } catch (err) {
        console.error("Error creating table:", err.message);
    }
}



