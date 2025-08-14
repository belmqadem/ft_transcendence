
export async function createFriendshipTable(db){
    try {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS friendships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            requester_id INTEGER NOT NULL,
            addressee_id INTEGER NOT NULL,
            status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) NOT NULL DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        );
        console.log("Friendships table created.");
    } catch (err) {
        console.error("Error creating table:", err.message);
    }
}
