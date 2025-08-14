export async function createBlockTable(db) {
    try {
        await db.run(
            `CREATE TABLE IF NOT EXISTS block (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blocker_id INTEGER NOT NULL,
            blocked_id INTEGER NOT NULL,
            created_at DATETIME DEFUALT CURRENT_TIMESTAMP
            )`
            );
            console.log('Block table created.');
    } catch (err) {
        console.error("Error creating table:", err.message);
    }
}