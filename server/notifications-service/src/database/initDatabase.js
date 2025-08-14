export async function createNotificationsTable(db){
    try {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient_id INTEGER,
            sender_id INTEGER,
            type TEXT NOT NULL,
            read INTEGER DEFAULT FALSE,
            delivered INTEGER DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        );
        console.log("Notifications table created.");
    } catch (error) {
        console.error("Error creating table:", error.message);
    }
}



